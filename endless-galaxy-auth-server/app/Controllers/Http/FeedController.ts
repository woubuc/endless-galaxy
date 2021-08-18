import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import FeedService from 'App/Services/FeedService';
import uniqid from 'uniqid';

export default class FeedController {

	public async getToken({ auth }: HttpContextContract) {
		let token = uniqid();
		FeedService.registerToken(auth.user!, token);
		return { token };
	}

	public async feed({ request, response, auth }: HttpContextContract) {
		let user = auth.user!;

		response.header('Cache-Control', 'no-cache');
		response.header('Content-Type', 'text/event-stream');
		response.flushHeaders(200);

		let req = request.request;
		let res = response.response;

		FeedService.registerFeed(user, res);

		req.on('close', () => {
			FeedService.unregisterFeed(user, res);
		});
	}

}
