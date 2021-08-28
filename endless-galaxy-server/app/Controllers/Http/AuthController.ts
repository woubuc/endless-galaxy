import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import VerifyEmail from 'App/Mailers/VerifyEmail';
import Ship from 'App/Models/Ship';
import User from 'App/Models/User';
import AuthLoginValidator from 'App/Validators/AuthLoginValidator';
import AuthRegisterValidator from 'App/Validators/AuthRegisterValidator';
import AuthVerifyValidator from 'App/Validators/AuthVerifyValidator';
import { DateTime } from 'luxon';
import uniqid from 'uniqid';

export default class AuthController {

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

		return Database.transaction(async (tx) => {
			let user = new User();
			user.email = body.email;
			user.password = body.password;
			user.money = 100_000_00;
			user.moneyLoaned = 0;
			user.emailVerifyToken = uniqid();
			await user.useTransaction(tx).save();
			await user.useTransaction(tx).related('discoveredPlanets').attach([1, 2, 3]);

			let ship = new Ship();
			ship.userId = user.id;
			ship.planetId = 2;
			ship.shipType = 'scout';
			ship.name = null;
			ship.movementMinutes = null;
			ship.movementMinutesRemaining = null;
			ship.inventory = {};
			await ship.useTransaction(tx).save();

			await new VerifyEmail(user).send();

			await auth.login(user);
			return response.noContent();
		});
	}

	public async verifyEmail({ request, response }: HttpContextContract) {
		let { email, token } = await request.validate(AuthVerifyValidator);

		let user = await User.findByOrFail('email', email);
		if (user.emailVerifyToken != token) {
			return response.badRequest();
		}

		user.emailVerifyToken = null;
		user.emailVerifySent = null;
		await user.save();

		return response.noContent();
	}

	public async resendVerifyEmail({ auth, response }: HttpContextContract) {
		let user = auth.user!;

		let timeSinceLastEmail = DateTime.now().diff(user.emailVerifySent ?? DateTime.now());
		if (timeSinceLastEmail.as('minutes') < 5) {
			return response.tooManyRequests({
				retryAt: user.emailVerifySent?.plus({ minutes: 5 })
			});
		}
		await new VerifyEmail(user).send();
		return response.noContent();
	}
}
