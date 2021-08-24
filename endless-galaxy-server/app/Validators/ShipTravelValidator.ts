import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export default class ShipTravelValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		planetId: schema.number([
			rules.exists({ table: 'planets', column: 'id' }),
		]),
	});

	public messages = {};
}
