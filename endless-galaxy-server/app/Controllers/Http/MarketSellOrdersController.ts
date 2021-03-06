import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import InsufficientInventoryException from 'App/Exceptions/InsufficientInventoryException';
import InsufficientMoneyException from 'App/Exceptions/InsufficientMoneyException';
import Market from 'App/Models/Market';
import MarketSellOrder from 'App/Models/MarketSellOrder';
import User from 'App/Models/User';
import Warehouse from 'App/Models/Warehouse';
import { add, take } from 'App/Util/InventoryUtils';
import MarketSellOrderCreateValidator from 'App/Validators/MarketSellOrderCreateValidator';
import MarketSellOrderDestroyValidator from 'App/Validators/MarketSellOrderDestroyValidator';

export default class MarketSellOrdersController {
	public async index() {
		return MarketSellOrder.all();
	}

	public async store({ auth, bouncer, request }: HttpContextContract) {
		let body = await request.validate(MarketSellOrderCreateValidator);
		await bouncer.with('Planet').authorize('view', body.planetId);

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

			return { id: order.id };
		});
	}

	public async buy({ auth, bouncer, request }: HttpContextContract) {
		let sellOrderId = parseInt(request.param('id'), 10);
		let userId = auth.user!.id;

		let { amount } = await request.validate(MarketSellOrderDestroyValidator);

		return Database.transaction(async (tx) => {
			let order = await MarketSellOrder.query()
				.useTransaction(tx)
				.forUpdate()
				.where({ id: sellOrderId })
				.preload('market')
				.firstOrFail();

			if (amount > order.stack.amount) {
				throw new InsufficientInventoryException();
			}

			let planetId = order.market.planetId;
			await bouncer.with('Planet').authorize('view', planetId);

			let warehouse = await Warehouse.query()
				.useTransaction(tx)
				.forUpdate()
				.where({
					planet_id: planetId,
					user_id: userId,
				})
				.firstOrFail();

			let cost = order.price * amount;

			let buyer = await User.query()
				.useTransaction(tx)
				.forUpdate()
				.where({ id: userId })
				.firstOrFail();

			if (buyer.money < cost) {
				throw new InsufficientMoneyException();
			}

			let seller = await User.query()
				.useTransaction(tx)
				.forUpdate()
				.where({ id: order.userId })
				.firstOrFail();

			buyer.money -= cost;
			await buyer
				.useTransaction(tx)
				.addProfitEntry('market', 'purchase', -cost, `itemType.${ order.itemType }`);

			seller.money += cost;
			await seller
				.useTransaction(tx)
				.addProfitEntry('market', 'sale', cost, `itemType.${ order.itemType }`);

			let market = await Market.query()
				.useTransaction(tx)
				.forUpdate()
				.where({ id: order.marketId })
				.firstOrFail();

			market.updateMarketRate(order.itemType, order.price);

			await Promise.all([
				buyer.useTransaction(tx).save(),
				seller.useTransaction(tx).save(),
				market.useTransaction(tx).save(),
			]);

			add(warehouse.inventory, {
				[order.itemType]: { amount, value: order.price },
			});

			await warehouse.useTransaction(tx).save();

			order.stack.amount -= amount;
			if (order.stack.amount === 0) {
				await order.useTransaction(tx).delete();
			} else {
				await order.useTransaction(tx).save();
			}
		});
	}

	public async destroy({ auth, request }: HttpContextContract) {
		let sellOrderId = parseInt(request.param('id'), 10);

		return Database.transaction(async (tx) => {
			let order = await MarketSellOrder.query()
				.useTransaction(tx)
				.forUpdate()
				.where({ id: sellOrderId, userId: auth.user!.id })
				.preload('market')
				.firstOrFail();

			let warehouse = await Warehouse.query()
				.useTransaction(tx)
				.forUpdate()
				.where({
					userId: auth.user!.id,
					planetId: order.market.planetId,
				})
				.firstOrFail();

			add(warehouse.inventory, { [order.itemType]: order.stack });

			await warehouse.useTransaction(tx).save();
			await order.useTransaction(tx).delete();
		});
	}
}
