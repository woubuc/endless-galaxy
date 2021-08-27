import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import { LucidRow } from '@ioc:Adonis/Lucid/Orm';
import InsufficientInventoryException from 'App/Exceptions/InsufficientInventoryException';
import InsufficientMoneyException from 'App/Exceptions/InsufficientMoneyException';
import { Inventory } from 'App/Models/Inventory';
import Market from 'App/Models/Market';
import MarketBuyOrder from 'App/Models/MarketBuyOrder';
import Shipyard from 'App/Models/Shipyard';
import User from 'App/Models/User';
import Warehouse from 'App/Models/Warehouse';
import { add, take } from 'App/Util/InventoryUtils';
import { clamp } from 'App/Util/NumberUtils';
import MarketBuyOrderCreateValidator from 'App/Validators/MarketBuyOrderCreateValidator';
import MarketBuyOrderSellValidator from 'App/Validators/MarketBuyOrderSellValidator';

export default class MarketBuyOrdersController {
	public async index() {
		return MarketBuyOrder.all();
	}

	public async store({ auth, bouncer, request }: HttpContextContract) {
		let body = await request.validate(MarketBuyOrderCreateValidator);
		await bouncer.with('Planet').authorize('view', body.planetId);

		return Database.transaction(async (tx) => {
			let user = await User.query()
				.useTransaction(tx)
				.forUpdate()
				.where({ id: auth.user!.id })
				.firstOrFail();

			let cost = body.price * body.amount;
			if (user.money < cost) {
				throw new InsufficientMoneyException();
			}

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

			let order = new MarketBuyOrder();
			order.userId = user.id;
			order.marketId = market.id;
			order.itemType = body.itemType;
			order.amount = body.amount;
			order.price = body.price;

			await warehouse.useTransaction(tx).save();
			await order.useTransaction(tx).save();

			user.money -= cost;
			await user.useTransaction(tx).addProfitEntry('market', 'buy_order', -cost, `itemType.${ body.itemType }`);
			await user.useTransaction(tx).save();

			return { id: order.id };
		});
	}

	public async sell({ auth, bouncer, request }: HttpContextContract) {
		let buyOrderId = parseInt(request.param('id'), 10);

		let { amount } = await request.validate(MarketBuyOrderSellValidator);

		return Database.transaction(async (tx) => {
			let userId = auth.user!.id;

			let order = await MarketBuyOrder.query()
				.useTransaction(tx)
				.forUpdate()
				.where({ id: buyOrderId })
				.preload('market')
				.firstOrFail();

			let planetId = order.market.planetId;
			await bouncer.with('Planet').authorize('view', planetId);

			amount = clamp(amount, 0, order.amount);

			let cost = amount * order.price;

			let sellerWarehouse = await Warehouse.query()
				.useTransaction(tx)
				.forUpdate()
				.where({ userId, planetId })
				.firstOrFail();

			let taken = take(sellerWarehouse.inventory, { [order.itemType]: amount });
			if (taken === false) {
				throw new InsufficientInventoryException();
			}

			let buyerWarehouse: LucidRow & { inventory: Inventory };
			if (order.userId == null) {
				buyerWarehouse = await Shipyard.query()
					.useTransaction(tx)
					.forUpdate()
					.where({ id: order.shipyardId, planetId })
					.firstOrFail();
			} else {
				buyerWarehouse = await Warehouse.query()
					.useTransaction(tx)
					.forUpdate()
					.where({ userId: order.userId, planetId })
					.firstOrFail();
			}

			taken[order.itemType].value = order.price;
			add(buyerWarehouse.inventory, taken);

			let seller = await User.query()
				.useTransaction(tx)
				.forUpdate()
				.where({ id: userId })
				.firstOrFail();

			seller.money += cost;
			await seller.useTransaction(tx).addProfitEntry('market', 'sale', cost, `itemType.${ order.itemType }`);

			if (order.userId != null) {
				let buyer = await User.query()
					.useTransaction(tx)
					.forUpdate()
					.where({ id: order.userId })
					.firstOrFail();

				buyer.money -= cost;
				await buyer.useTransaction(tx).addProfitEntry('market', 'buy', -cost, `itemType.${ order.itemType }`);
				await buyer.useTransaction(tx).save();
			}

			let market = await Market.query()
				.useTransaction(tx)
				.forUpdate()
				.where({ id: order.marketId })
				.firstOrFail();

			market.updateMarketRate(order.itemType, amount);

			order.amount -= amount;
			if (order.amount <= 0) {
				await order.useTransaction(tx).delete();
			} else {
				await order.useTransaction(tx).save();
			}

			await Promise.all([
				sellerWarehouse.useTransaction(tx).save(),
				buyerWarehouse.useTransaction(tx).save(),
				seller.useTransaction(tx).save(),
				market.useTransaction(tx).save(),
			])
		});
	}

	public async destroy({ auth, request }: HttpContextContract) {
		let buyOrderId = parseInt(request.param('id'), 10);

		return Database.transaction(async (tx) => {
			let user = await User.query()
				.useTransaction(tx)
				.forUpdate()
				.where({ id: auth.user!.id })
				.firstOrFail();

			let order = await MarketBuyOrder.query()
				.useTransaction(tx)
				.forUpdate()
				.where({ id: buyOrderId, userId: auth.user!.id })
				.firstOrFail();

			let refund = order.amount * order.price;
			user.money += refund;
			await user.useTransaction(tx).addProfitEntry('market', 'buy_order', refund, `itemType.${ order.itemType }`);
			await user.useTransaction(tx).save();

			await order.useTransaction(tx).delete();
		});
	}
}
