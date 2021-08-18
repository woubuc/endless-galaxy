import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import Market from 'App/Models/Market';
import MarketSellOrder from 'App/Models/MarketSellOrder';
import Warehouse from 'App/Models/Warehouse';
import FeedService from 'App/Services/FeedService';
import { take } from 'App/Util/InventoryUtils';
import MarketSellOrderCreateValidator from 'App/Validators/MarketSellOrderCreateValidator';

export default class MarketSellOrdersController {
	public async index() {
		return MarketSellOrder.all();
	}

	public async store({ auth, bouncer, request, response }: HttpContextContract) {
		let body = await request.validate(MarketSellOrderCreateValidator);
		await bouncer.authorize('viewPlanet', body.planetId);

		let user = auth.user!;

		return Database.transaction(async (tx) => {
			let market = await Market.query()
				.useTransaction(tx)
				.where({ planetId: body.planetId })
				.firstOrFail();

			let warehouse = await Warehouse.query()
				.useTransaction(tx)
				.forUpdate()
				.where({
					planetId: body.planetId,
					userId: user.id,
				})
				.firstOrFail();


			let taken = take(warehouse.inventory, { [body.itemType]: body.amount });
			if (taken === false) {
				return response.badRequest();
			}

			let order = new MarketSellOrder();
			order.marketId = market.id;
			order.itemType = body.itemType;
			order.amount = body.amount;
			order.price = body.price;

			await warehouse.useTransaction(tx).save();
			await order.useTransaction(tx).save();

			await FeedService.emitWarehouse(user.id, warehouse);
			await FeedService.broadcastMarketSellOrder(order);

			return { id: order.id };
		});
	}
}
