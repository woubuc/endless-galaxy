import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ShipsController {

	public async index({ auth }: HttpContextContract) {
		let user = auth.user!;
		await user.load('ships');
		return user.ships;
	}

}
