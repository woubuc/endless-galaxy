import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Profit from 'App/Models/Profit';
import GameService from 'App/Services/GameService';

export default class ProfitsController {

	public async last({ auth }: HttpContextContract) {
		let user = auth.user!;

		return Profit.firstOrCreate({
			userId: user.id,
			week: GameService.state.week,
		}, {
			userId: user.id,
			week: GameService.state.week,
			total: 0,
			profitData: {},
		});
	}

}
