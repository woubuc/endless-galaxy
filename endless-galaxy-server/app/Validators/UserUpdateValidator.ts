import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';

export default class UserUpdateValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		companyName: schema.string.optional({ trim: true }, [rules.minLength(6)]),
	});

	public messages = {};
}
