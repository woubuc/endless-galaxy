import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class FactoryUpdateValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		recipeDataId: schema.string.optional(),
	});

	public messages = {};
}
