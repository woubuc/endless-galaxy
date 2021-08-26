import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class WarehouseUpdateAutoTraderValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		amount: schema.number(),

		sell: schema.boolean(),
		sellMode: schema.enum(['fixed', 'profit', 'market', 'lowest'] as const),
		sellPrice: schema.number(),
		sellAvoidLoss: schema.boolean(),

		buy: schema.boolean(),
		buyMode: schema.enum(['fixed'] as const),
		buyPrice: schema.number(),
	});

	public messages = {};
}
