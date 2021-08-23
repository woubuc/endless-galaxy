import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import InsufficientMoneyException from 'App/Exceptions/InsufficientMoneyException';
import Factory from 'App/Models/Factory';
import User from 'App/Models/User';
import FactoryTypeDataService from 'App/Services/FactoryTypeDataService';
import RecipeDataService from 'App/Services/RecipeDataService';
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

			if (user.money < factoryType.price) {
				throw new InsufficientMoneyException();
			}

			user.money -= factoryType.price;
			await user.useTransaction(tx).addProfitEntry('construction', 'build', -factoryType.price, factoryType.id);
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
		let { recipeDataId } = await request.validate(FactoryUpdateValidator);

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
				let recipeData = RecipeDataService.get(recipeDataId);

				factory.recipe = recipeDataId;
				factory.hoursRemaining = recipeData.hours;
				factory.repeat = true;
			}

			await factory.useTransaction(tx).save();
		});
	}
}
