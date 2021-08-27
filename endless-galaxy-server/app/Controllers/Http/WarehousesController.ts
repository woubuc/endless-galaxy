import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import InsufficientMoneyException from 'App/Exceptions/InsufficientMoneyException';
import { AutoTraderBuyMode, AutoTraderSellMode } from 'App/Models/AutoTraderConfig';
import User from 'App/Models/User';
import Warehouse from 'App/Models/Warehouse';
import ItemTypeDataService from 'App/Services/ItemTypeDataService';
import WarehouseCreateValidator from 'App/Validators/WarehouseCreateValidator';
import WarehouseUpdateAutoTraderValidator from 'App/Validators/WarehouseUpdateAutoTraderValidator';
import WarehouseUpdateValidator from 'App/Validators/WarehouseUpdateValidator';

export const WAREHOUSE_BUILD_COST = 10_000_00;

export default class WarehousesController {
	public async index({ auth }: HttpContextContract) {
		let user = auth.user!;
		await user.load('warehouses');
		return user.warehouses;
	}

	public async store({ auth, bouncer, request, response }: HttpContextContract) {
		let userId = auth.user!.id;

		let { planetId } = await request.validate(WarehouseCreateValidator);
		await bouncer.with('Planet').authorize('view', planetId);

		let existingWarehouse = await Warehouse.query()
			.where({ planetId, userId })
			.first();

		if (existingWarehouse != null) {
			return response.unprocessableEntity({ error: 'warehouse_exists' });
		}

		return Database.transaction(async (tx) => {
			let user = await User.query()
				.useTransaction(tx)
				.forUpdate()
				.where({ id: userId })
				.firstOrFail();

			if (user.money < WAREHOUSE_BUILD_COST) {
				return response.unprocessableEntity({ error: 'insufficient_money' });
			}

			user.money -= WAREHOUSE_BUILD_COST;
			await user.useTransaction(tx).save();
			await user.useTransaction(tx).addProfitEntry('construction', 'build', -WAREHOUSE_BUILD_COST, 'building.warehouse');

			let warehouse = new Warehouse();
			warehouse.planetId = planetId;
			warehouse.userId = userId;
			warehouse.size = 1;
			await warehouse.useTransaction(tx).save();

			return { id: warehouse.id };
		});
	}

	public async update({ auth, request }: HttpContextContract) {
		let id = parseInt(request.param('id'), 10);
		let { size } = await request.validate(WarehouseUpdateValidator);

		return Database.transaction(async (tx) => {
			let warehouse = await Warehouse.query()
				.useTransaction(tx)
				.forUpdate()
				.where({ id, user_id: auth.user!.id })
				.firstOrFail();

			if (size != undefined) {
				let sizeDiff = size - warehouse.size;
				let cost = WAREHOUSE_BUILD_COST * sizeDiff;

				let user = await User.query()
					.useTransaction(tx)
					.forUpdate()
					.where({ id: auth.user!.id })
					.firstOrFail();

				if (user.money < cost) {
					throw new InsufficientMoneyException();
				}

				user.money -= cost;
				user.useTransaction(tx).addProfitEntry('construction', 'upgrade', -cost, 'building.warehouse');
				await user.useTransaction(tx).save();

				warehouse.size = size;
			}

			await warehouse.useTransaction(tx).save();
		});
	}

	public async updateAutoTrader({ auth, request }: HttpContextContract) {
		let id = parseInt(request.param('id'), 10);
		let itemTypeId = request.param('itemTypeId');
		ItemTypeDataService.get(itemTypeId);

		let body = await request.validate(WarehouseUpdateAutoTraderValidator);

		return Database.transaction(async (tx) => {
			let warehouse = await Warehouse.query()
				.useTransaction(tx)
				.forUpdate()
				.where({ id, user_id: auth.user!.id })
				.firstOrFail();

			warehouse.autoTrader[itemTypeId] = {
				amount: body.amount,

				sell: body.sell,
				sellMode: body.sellMode as AutoTraderSellMode,
				sellPrice: body.sellPrice,
				sellAvoidLoss: body.sellAvoidLoss,

				buy: body.buy,
				buyMode: body.buyMode as AutoTraderBuyMode,
				buyPrice: body.buyPrice,
			};

			await warehouse.useTransaction(tx).save();
		});
	}
}
