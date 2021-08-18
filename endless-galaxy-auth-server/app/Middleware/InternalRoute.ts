import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env';

export default class InternalRoute {
  public async handle ({ request, response }: HttpContextContract, next: () => Promise<void>) {
  	let key = request.qs().key;
  	if (key == undefined) {
		return response.unauthorized();
	}

  	if (key != Env.get('INTERNAL_ROUTE_KEY')) {
  		return response.unauthorized();
	}

    await next()
  }
}
