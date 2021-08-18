import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import FeedService from 'App/Services/FeedService';
import UserUpdateValidator from 'App/Validators/UserUpdateValidator';

export default class UserController {

	public async show({ auth }: HttpContextContract) {
		return auth.user;
	}

	public async update({ auth, request, response }: HttpContextContract) {
		let user = auth.user!;

		let changes = await request.validate(UserUpdateValidator);
		console.log('changes', changes);
		if (changes.companyName && !!user.companyName) {
			return response.badRequest();
		}

		for (let [key, value] of Object.entries(changes)) {
			user[key] = value;
		}
		await user.save();
		await FeedService.emitUser(user);
	}

}
