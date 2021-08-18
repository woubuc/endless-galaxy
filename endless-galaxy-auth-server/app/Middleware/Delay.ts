import Env from '@ioc:Adonis/Core/Env';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { wait } from 'App/Util/TimeUtils';

export default class Delay {
  public async handle ({}: HttpContextContract, next: () => Promise<void>) {
  	if (Env.get('NODE_ENV') === 'development') {
    	await wait(200 + (Math.random() * 300));
	}
    await next()
  }
}
