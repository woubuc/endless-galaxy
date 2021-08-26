import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export default class WarehouseUpdateValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		size: schema.number.optional([rules.unsigned()]),
	});

	public messages = {};
}
