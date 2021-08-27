import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import InsufficientMoneyException from 'App/Exceptions/InsufficientMoneyException';
import Factory from 'App/Models/Factory';
import Planet from 'App/Models/Planet';
import User from 'App/Models/User';
import FactoryTypeDataService from 'App/Services/FactoryTypeDataService';
import PlanetTypeDataService from 'App/Services/PlanetTypeDataService';
import RecipeDataService from 'App/Services/RecipeDataService';
import { clamp } from 'App/Util/NumberUtils';
import FactoryStoreValidator from 'App/Validators/FactoryStoreValidator';
import FactoryUpdateValidator from 'App/Validators/FactoryUpdateValidator';

export default class FactoriesController {

	public async index({ auth }: HttpContextContract) {
		let user = auth.user!;
		await user.load('factories');
		return user.factories;
	}

	public async store({ auth, bouncer, request }: HttpContextContract) {
		let { planetId, factoryTypeId } = await request.validate(FactoryStoreValidator);
		await bouncer.with('Planet').authorize('build', planetId);

		let factoryType = await FactoryTypeDataService.get(factoryTypeId);

		return Database.transaction(async (tx) => {
			let user = await User.query()
				.useTransaction(tx)
				.forUpdate()
				.where('id', auth.user!.id)
				.firstOrFail();

			let planet = await Planet.findOrFail(planetId);
			let planetType = PlanetTypeDataService.get(planet.planetType);

			let buildCost = factoryType.price * planetType.buildCostModifier;
			if (user.money < buildCost) {
				throw new InsufficientMoneyException();
			}

			user.money -= buildCost;
			await user.useTransaction(tx).addProfitEntry('construction', 'build', -buildCost, `factoryType.${ factoryType.id }`);
			await user.useTransaction(tx).save();

			let factory = new Factory();
			factory.userId = user.id;
			factory.planetId = planetId;
			factory.factoryType = factoryType.id;
			factory.size = 1;
			factory.hoursRemaining = 0;
			factory.productionCosts = 0;
			factory.repeat = false;
			await factory.useTransaction(tx).save();

			return { id: factory.id };
		});
	}

	public async update({ auth, bouncer, request }: HttpContextContract) {
		let factoryId = parseInt(request.param('id'), 10);
		let { recipeDataId, repeat, size } = await request.validate(FactoryUpdateValidator);

		return Database.transaction(async (tx) => {
			let factory = await Factory.query()
				.useTransaction(tx)
				.forUpdate()
				.where({
					id: factoryId,
					user_id: auth.user!.id,
				})
				.firstOrFail();

			await bouncer.with('Planet').authorize('view', factory.planetId);

			if (recipeDataId != undefined) {
				if (recipeDataId === '$clear') {
					factory.recipe = null;
				} else {
					RecipeDataService.get(recipeDataId);
					factory.recipe = recipeDataId;
				}

				factory.hoursRemaining = 0;
				factory.repeat = true;
			}

			if (repeat != undefined) {
				factory.repeat = repeat;

				if (factory.hoursRemaining === 0) {
					factory.recipe = null;
				}
			}

			if (size != undefined) {
				let factoryType = FactoryTypeDataService.get(factory.factoryType);
				let sizeDiff = size - factory.size;
				let cost = clamp(factoryType.price * sizeDiff, 0, Infinity);

				let user = await User.query()
					.useTransaction(tx)
					.forUpdate()
					.where({ id: auth.user!.id })
					.firstOrFail();

				if (user.money < cost) {
					throw new InsufficientMoneyException();
				}

				factory.size = size;
				user.money -= cost;

				await user.useTransaction(tx).addProfitEntry('construction', 'upgrade', -cost, `factoryType.${ factory.factoryType }`);
				await user.useTransaction(tx).save();
			}

			await factory.useTransaction(tx).save();
		});
	}

	public async destroy({ auth, request }: HttpContextContract) {
		let factoryId = parseInt(request.param('id'), 10);

		return Database.transaction(async (tx) => {
			let factory = await Factory.query()
				.useTransaction(tx)
				.forUpdate()
				.where({
					id: factoryId,
					userId: auth.user!.id,
				})
				.firstOrFail();

			await factory.useTransaction(tx).delete();
		});
	}
}
