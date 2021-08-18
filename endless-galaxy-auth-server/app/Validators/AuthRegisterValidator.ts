import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';

export default class AuthRegisterValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		email: schema.string({ trim: true }, [
			rules.email(),
			rules.unique({ table: 'users', column: 'email' }),
			rules.minLength(6),
		]),
		password: schema.string({ trim: true }, [
			rules.minLength(12),
		]),
	});

	public messages = {};
}
