import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import InsufficientInventoryException from 'App/Exceptions/InsufficientInventoryException';
import InsufficientMoneyException from 'App/Exceptions/InsufficientMoneyException';
import Market from 'App/Models/Market';
import MarketSellOrder from 'App/Models/MarketSellOrder';
import User from 'App/Models/User';
import Warehouse from 'App/Models/Warehouse';
import FeedService from 'App/Services/FeedService';
import { add, take } from 'App/Util/InventoryUtils';
import MarketSellOrderCreateValidator from 'App/Validators/MarketSellOrderCreateValidator';
import MarketSellOrderDestroyValidator from 'App/Validators/MarketSellOrderDestroyValidator';

export default class MarketSellOrdersController {
	public async index() {
		return MarketSellOrder.all();
	}

	public async store({ auth, bouncer, request }: HttpContextContract) {
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
				throw new InsufficientInventoryException();
			}

			let order = new MarketSellOrder();
			order.userId = user.id;
			order.marketId = market.id;
			order.itemType = body.itemType;
			order.stack = taken[body.itemType];
			order.price = body.price;

			await warehouse.useTransaction(tx).save();
			await order.useTransaction(tx).save();

			await FeedService.emitWarehouse(user.id, warehouse);
			await FeedService.broadcastMarketSellOrder(order);

			return { id: order.id };
		});
	}

	public async destroy({ auth, bouncer, request }: HttpContextContract) {
		let sellOrderId = parseInt(request.param('id'), 10);
		let userId = auth.user!.id;

		let { amount } = await request.validate(MarketSellOrderDestroyValidator);

		return Database.transaction(async (tx) => {
			console.log('loading sell order');
			let order = await MarketSellOrder.query()
				.useTransaction(tx)
				.forUpdate()
				.where({ id: sellOrderId })
				.preload('market')
				.firstOrFail();
			console.log(order);

			if (amount > order.stack.amount) {
				throw new InsufficientInventoryException();
			}
			console.log('amount ok');

			let planetId = order.market.planetId;
			await bouncer.authorize('viewPlanet', planetId);
			console.log('planet ok');

			console.log('loading warehouse');
			let warehouse = await Warehouse.query()
				.useTransaction(tx)
				.forUpdate()
				.where({
					planet_id: planetId,
					user_id: userId,
				})
				.firstOrFail();
			console.log(warehouse);

			let cost = order.price * amount;
			console.log(cost);

			if (order.userId !== userId) {
				console.log('loading buyer');
				let buyer = await User.query()
					.useTransaction(tx)
					.forUpdate()
					.where({ id: userId })
					.firstOrFail();
				console.log(buyer);

				if (buyer.money < cost) {
					throw new InsufficientMoneyException();
				}
				console.log('money ok');

				console.log('loading seller');
				let seller = await User.query()
					.useTransaction(tx)
					.forUpdate()
					.where({ id: order.userId })
					.firstOrFail();
				console.log(seller);

				buyer.money -= cost;
				await buyer
					.useTransaction(tx)
					.addProfitEntry('market', 'purchase', -cost, order.itemType);

				seller.money += cost;
				await seller
					.useTransaction(tx)
					.addProfitEntry('market', 'sale', cost, order.itemType);

				console.log('saving buyer & seller');
				await buyer.useTransaction(tx).save();
				await seller.useTransaction(tx).save();
				console.log('saved');

				await FeedService.emitUser(buyer);
				await FeedService.emitUser(seller);

				order.stack.value = order.price;
			}

			add(warehouse.inventory, { [order.itemType]: order.stack });

			console.log('saving warehouse');
			await warehouse.useTransaction(tx).save();
			console.log('warehouse saved');

			order.stack.amount -= amount;
			if (order.stack.amount === 0) {
				console.log('deleting order');
				await order.useTransaction(tx).delete();
				await FeedService.broadcastDeleteMarketSellOrder(order);
				console.log('order deleted');
			} else {
				console.log('saving order');
				await order.useTransaction(tx).save();
				await FeedService.broadcastMarketSellOrder(order);
				console.log('order saved');
			}

			await FeedService.emitWarehouse(warehouse.userId, warehouse);
		});
	}
}
