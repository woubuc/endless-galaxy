import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import AuthLoginValidator from 'App/Validators/AuthLoginValidator';
import AuthRegisterValidator from 'App/Validators/AuthRegisterValidator';

export default class AuthController {

	public async me({ auth, response }: HttpContextContract) {
		if (auth.user) {
			await auth.user.load('profitHistory', q => q.orderBy('day', 'desc').limit(1));
			return auth.user;
		} else {
			return response.unauthorized();
		}
	}

	public async login({ auth, request, response }: HttpContextContract) {
		let body = await request.validate(AuthLoginValidator);
		await auth.attempt(body.email, body.password, body.remember ?? false);
		return response.noContent();
	}

	public async logout({ auth, response }: HttpContextContract) {
		await auth.logout();
		return response.noContent();
	}

	public async register({ auth, request, response }: HttpContextContract) {
		let body = await request.validate(AuthRegisterValidator);

		let user = new User();
		user.email = body.email;
		user.password = body.password;
		user.money = 1_000_00;
		user.moneyLoaned = 0;
		await user.save();
		await user.related('discoveredPlanets').attach([1, 2, 3]);

		await auth.login(user);
		return response.noContent();
	}
}
