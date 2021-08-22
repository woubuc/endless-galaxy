import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import TickService from 'App/Services/TickService';

/**
 * Awaits a pending game tick before processing the request.
 *
 * When the game tick is running, all requests need to be held until the tick
 * finishes to avoid returning incomplete or invalid data. The game tick shouldn't
 * take more than a few seconds (in extreme cases), so it shouldn't trigger any
 * request timeouts to simply await it here.
 *
 * If this delay does cause issues, the tick probably needs to be optimised.
 */
export default class AwaitTick {
	public async handle({}: HttpContextContract, next: () => Promise<void>) {
		await TickService.pendingTick;
		await next();
	}
}
