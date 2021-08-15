import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Planet from 'App/Models/Planet';

export default class PlanetsController {

	public async index({ auth }: HttpContextContract) {
		let user = auth.user!;
		await user.load('discoveredPlanets', q => q
			.preload('ships')
			.preload('shipsTargeting')
		);
		return user.discoveredPlanets;
	}

	public async show({ request, bouncer }: HttpContextContract) {
		let planetId = parseInt(request.param('id'), 10);
		await bouncer.authorize('viewPlanet', planetId);

		return Planet.query()
			.where({ id: planetId })
			.preload('ships')
			.preload('shipsTargeting')
			.firstOrFail();
	}
}
