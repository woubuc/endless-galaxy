import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class FactoriesController {

	public async index({ auth }: HttpContextContract) {
		let user = auth.user!;
		await user.load('factories');
		return user.factories;
	}
}
