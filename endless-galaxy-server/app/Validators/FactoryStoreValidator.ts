import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class FactoryStoreValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		planetId: schema.number(),
		factoryTypeId: schema.string(),
	});

	public messages = {};
}
