import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class MarketBuyOrderSellValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		amount: schema.number(),
	});

	public messages = {};
}
