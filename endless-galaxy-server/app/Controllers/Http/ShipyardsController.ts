import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import Shipyard from 'App/Models/Shipyard';
import ShipyardOrder from 'App/Models/ShipyardOrder';
import FeedService from 'App/Services/FeedService';
import ShipTypeService, { ShipTypeId } from 'App/Services/ShipTypeService';
import ShipyardOrderValidator from 'App/Validators/ShipyardOrderValidator';
import { klona } from 'klona';

export default class ShipyardsController {

	public async index() {
		return Shipyard.query()
			.withCount('orders')
			.exec();
	}

	public async order({ bouncer, request, response, session }: HttpContextContract) {
		let shipyardId = parseInt(request.param('id'), 10);
		await bouncer.authorize('accessShipyard', shipyardId);

		let { shipTypeId } = await request.validate(ShipyardOrderValidator);
		let shipType = ShipTypeService.get(shipTypeId);

		let shipyard = await Shipyard.findOrFail(shipyardId);
		let totalCost = 0;
		for (let [id, requiredAmount] of Object.entries(shipType.resources)) {
			if (shipyard.inventory[id]?.amount < requiredAmount) {
				return response.noContent();
			}
			totalCost += shipyard.inventory[id].value * requiredAmount;
		}

		let orderData: TempOrderData = {
			shipyardId,
			shipTypeId,
			totalCost,
		};
		session.put('shipyard_order', orderData);
		return orderData;
	}

	public async confirmOrder({ auth, bouncer, request, response, session }: HttpContextContract) {
		let user = auth.user!;

		let shipyardId = parseInt(request.param('id'), 10);
		await bouncer.authorize('accessShipyard', shipyardId);

		return Database.transaction(async (trx) => {
			let orderData: TempOrderData | undefined = session.get('shipyard_order');
			session.forget('shipyard_order');

			if (orderData == undefined) {
				return response.badRequest();
			}

			let shipyard = await Shipyard.get(shipyardId);
			let shipType = ShipTypeService.get(orderData.shipTypeId);

			await user.refresh();
			user.money -= orderData.totalCost;
			user.useTransaction(trx);
			await user.save();

			let order = new ShipyardOrder();
			order.shipyardId = shipyardId;
			order.userId = user.id;
			order.shipType = shipType.id;
			order.budgetRemaining = orderData.totalCost;
			order.resourcesRemaining = klona(shipType.resources);
			order.useTransaction(trx);
			await order.save();

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
