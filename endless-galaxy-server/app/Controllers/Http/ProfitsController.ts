import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profit from 'App/Models/Profit';

export default class ProfitsController {

	public async last({ auth }: HttpContextContract) {
		let user = auth.user!;

		return Profit.query()
			.where({ user_id: user.id })
			.orderBy('day', 'desc')
			.first();
	}

	public async index() {

	}

}
