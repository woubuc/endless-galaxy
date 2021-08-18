import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export default class AuthLoginValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		email: schema.string({ trim: true }, [
			rules.email(),
			rules.exists({ table: 'users', column: 'email' }),
		]),
		password: schema.string({ trim: true }),
		remember: schema.boolean.optional(),
	});

	public messages = {};
}
