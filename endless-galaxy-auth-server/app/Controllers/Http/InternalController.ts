import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import FeedService from 'App/Services/FeedService';

export default class InternalController {

	public async validateToken({ request, response }: HttpContextContract) {
		let token = request.qs().token;
		let userId = FeedService.validateToken(token);
		if (userId === false) {
			return response.unauthorized();
		}
		return userId;
	}
}
