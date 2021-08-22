import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Planet from 'App/Models/Planet';

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
}
