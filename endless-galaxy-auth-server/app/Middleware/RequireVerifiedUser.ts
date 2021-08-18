import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UnverifiedException from 'App/Exceptions/UnverifiedException';

export default class RequireVerifiedUser {
	public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
		if (!auth.user?.emailVerified) {
			throw new UnverifiedException();
		}

		await next();
	}
}
