import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class ShipyardOrderValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		shipTypeId: schema.string({ trim: true }),
	});

	public messages = {};
}
