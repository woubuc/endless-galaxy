import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';

export default class ShipTransferValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		itemTypeId: schema.string({ trim: true }),
		amount: schema.number([rules.unsigned()]),
		to: schema.enum(['ship', 'warehouse'] as const),
	});

	public messages = {};
}
