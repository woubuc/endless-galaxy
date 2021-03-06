import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class MarketSellOrderCreateValidator {
	constructor(protected ctx: HttpContextContract) {}

	public schema = schema.create({
		planetId: schema.number(),
		itemType: schema.string(),
		price: schema.number(),
		amount: schema.number(),
	});

	public messages = {};
}
