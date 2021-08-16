import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { wait } from 'App/Util/TimeUtils';

export default class Delay {
  public async handle ({}: HttpContextContract, next: () => Promise<void>) {
    await wait(250 + (Math.random() * 500));
    await next()
  }
}
