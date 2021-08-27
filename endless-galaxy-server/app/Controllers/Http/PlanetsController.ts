import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import { PLANET_SCAVENGE_COST } from 'App/Constants';
import InsufficientMoneyException from 'App/Exceptions/InsufficientMoneyException';
import { Inventory } from 'App/Models/Inventory';
import Planet from 'App/Models/Planet';
import User from 'App/Models/User';
import Warehouse from 'App/Models/Warehouse';
import PlanetTypeDataService from 'App/Services/PlanetTypeDataService';
import { add } from 'App/Util/InventoryUtils';

export default class PlanetsController {

	public async index({ auth }: HttpContextContract) {
		let user = auth.user!;
		await user.load('discoveredPlanets', q => q.orderBy('name', 'asc'));
		return user.discoveredPlanets;
	}

	public async show({ request, bouncer }: HttpContextContract) {
		let planetId = parseInt(request.param('id'), 10);
		await bouncer.with('Planet').authorize('view', planetId);

		return Planet.findOrFail(planetId);
	}

	public async scavenge({ auth, request }: HttpContextContract) {
		let planetId = parseInt(request.param('id'), 10);
		let planet = await Planet.findOrFail(planetId);

		return Database.transaction(async (tx) => {
			let user = await User.query()
				.useTransaction(tx)
				.forUpdate()
				.where({ id: auth.user!.id })
				.firstOrFail();

			if (user.money < PLANET_SCAVENGE_COST) {
				throw new InsufficientMoneyException();
			}

			let warehouse = await Warehouse.query()
				.useTransaction(tx)
				.forUpdate()
				.where({
					userId: auth.user!.id,
					planetId,
				})
				.firstOrFail();

			user.money -= PLANET_SCAVENGE_COST;
			await user.useTransaction(tx).addProfitEntry('scavenge', 'scavenge', -PLANET_SCAVENGE_COST);
			await user.useTransaction(tx).save();

			let planetType = PlanetTypeDataService.get(planet.planetType);
			let numberOfItems = 3 + Math.floor(Math.random() * 6);
			let value = Math.round(PLANET_SCAVENGE_COST / numberOfItems);
			let items: Inventory = {};

			for (let i = 0; i < numberOfItems; i++) {
				let index = Math.floor(Math.random() * planetType.scavenge.length);
				let item = planetType.scavenge[index];
				add(items, { [item]: { amount: 1, value } });
			}

			add(warehouse.inventory, items);
			await warehouse.useTransaction(tx).save();

			return items;
		});
	}
}
