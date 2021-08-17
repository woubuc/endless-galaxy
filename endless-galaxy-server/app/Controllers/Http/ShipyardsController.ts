import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import Shipyard from 'App/Models/Shipyard';
import ShipyardOrder from 'App/Models/ShipyardOrder';
import User from 'App/Models/User';
import FeedService from 'App/Services/FeedService';
import ShipTypeService, { ShipTypeId } from 'App/Services/ShipTypeService';
import { contains, takeUnchecked } from 'App/Util/InventoryUtils';
import ShipyardOrderValidator from 'App/Validators/ShipyardOrderValidator';
import { DateTime } from 'luxon';

export default class ShipyardsController {

	public async index() {
		return Shipyard.query()
			.preload('orders', q => q
				.where('work_remaining', '>', 0)
				.orderBy('placed'),
			)
			.exec();
	}

	public async order({ bouncer, request, response, session }: HttpContextContract) {
		let shipyardId = parseInt(request.param('id'), 10);
		await bouncer.authorize('accessShipyard', shipyardId);

		let { shipTypeId } = await request.validate(ShipyardOrderValidator);
		let shipType = ShipTypeService.get(shipTypeId);

		let shipyard = await Shipyard.findOrFail(shipyardId);
		if (!contains(shipyard.inventory, shipType.resources)) {
			return response.noContent();
		}

		let totalCost = 0;
		for (let [id, amount] of Object.entries(shipType.resources)) {
			totalCost += shipyard.inventory[id].value * amount;
		}
		totalCost *= 1.25;

		let orderData: TempOrderData = {
			shipyardId,
			shipTypeId,
			totalCost,
		};
		session.put('shipyard_order', orderData);
		return orderData;
	}

	public async confirmOrder({ auth, bouncer, request, response, session }: HttpContextContract) {
		let shipyardId = parseInt(request.param('id'), 10);
		await bouncer.authorize('accessShipyard', shipyardId);

		return Database.transaction(async (tx) => {
			let orderData: TempOrderData | undefined = session.get('shipyard_order');
			session.forget('shipyard_order');

			if (orderData == undefined) {
				return response.badRequest();
			}

			let user = await User.query()
				.useTransaction(tx)
				.forUpdate()
				.where('id', auth.user!.id)
				.firstOrFail();

			let shipyard = await Shipyard.query()
				.useTransaction(tx)
				.forUpdate()
				.withCount('orders')
				.where('id', shipyardId)
				.firstOrFail();

			let shipType = ShipTypeService.get(orderData.shipTypeId);

			user.money -= orderData.totalCost;
			user.useTransaction(tx);
			await user.save();

			await user.addProfitEntry('purchases', `shipyard_order`, -orderData.totalCost, orderData.shipTypeId);

			let order = new ShipyardOrder();
			order.shipyardId = shipyardId;
			order.userId = user.id;
			order.shipType = shipType.id;
			order.workRemaining = shipType.totalResources;
			order.placed = DateTime.now();
			order.useTransaction(tx);
			await order.save();

			takeUnchecked(shipyard.inventory, shipType.resources);
			shipyard.useTransaction(tx);
			await shipyard.save();

			await FeedService.emitUser(user);
			await FeedService.emitShipyardOrder(user, order);

			shipyard.$extras.orders_count++;
			await FeedService.broadcastShipyard(shipyard);

			return { id: order.id };
		});
	}
}

interface TempOrderData {
	shipyardId: number;
	shipTypeId: ShipTypeId;
	totalCost: number;
}
