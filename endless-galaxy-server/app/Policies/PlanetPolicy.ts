import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer';
import Database from '@ioc:Adonis/Lucid/Database';
import Planet from 'App/Models/Planet';
import User from 'App/Models/User';
import Warehouse from 'App/Models/Warehouse';
import { EntityOrId, getId } from 'App/Util/EntityOrId';

export default class PlanetPolicy extends BasePolicy {
	public async view(user: User, planet: EntityOrId<Planet>) {
		let planetDiscovered = await Database.query()
			.select('*')
			.from('user_discovered_planets')
			.where({
				user_id: user.id,
				planet_id: getId(planet),
			})
			.first();

		return !!planetDiscovered;
	}

	public async build(user: User, planet: EntityOrId<Planet>) {
		let warehouse = await Warehouse.query()
			.where({
				user_id: user.id,
				planet_id: getId(planet),
			})
			.first();

		return !!warehouse;
	}
}
