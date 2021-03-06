import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import Shipyard from 'App/Models/Shipyard';
import ShipyardOrder from 'App/Models/ShipyardOrder';
import User from 'App/Models/User';
import ShipTypeService, { ShipTypeId } from 'App/Services/ShipTypeDataService';
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

		let { shipTypeId } = await request.validate(ShipyardOrderValidator);
		let shipType = ShipTypeService.get(shipTypeId);

		let shipyard = await Shipyard.findOrFail(shipyardId);
		await bouncer.with('Planet').authorize('view', shipyard.planetId);
		if (!contains(shipyard.inventory, shipType.resources)) {
			return response.noContent();
		}

		let totalShipCost = 0;
		for (let [id, amount] of Object.entries(shipType.resources)) {
			totalShipCost += shipyard.inventory[id].value * amount;
		}

		// Because simulated AI shipyard employees need to eat, too
		totalShipCost *= 1.25;

		let orderData: TempOrderData = {
			shipyardId,
			shipTypeId,
			totalCost: totalShipCost,
		};
		session.put('shipyard_order', orderData);
		return orderData;
	}

	public async confirmOrder({ auth, bouncer, request, response, session }: HttpContextContract) {
		let shipyardId = parseInt(request.param('id'), 10);

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

			await bouncer.with('Planet').authorize('view', shipyard.planetId);

			let shipType = ShipTypeService.get(orderData.shipTypeId);

			user.money -= orderData.totalCost;
			user.useTransaction(tx);
			await user.save();
			await user.addProfitEntry('ship', `shipyard_order`, -orderData.totalCost, `shipType.${ orderData.shipTypeId }`);

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
			shipyard.$extras.orders_count++;
			await shipyard.save();

			return { id: order.id };
		});
	}
}

interface TempOrderData {
	shipyardId: number;
	shipTypeId: ShipTypeId;
	totalCost: number;
}
