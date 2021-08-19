import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class WarehouseCreateValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		planetId: schema.number(),
	});

	public messages = {};
}
