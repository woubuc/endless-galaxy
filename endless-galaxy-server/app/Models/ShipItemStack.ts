import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Ship from 'App/Models/Ship';

export default class ShipItemStack extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public shipId: number;

	@belongsTo(() => Ship)
	public ship: BelongsTo<typeof Ship>;

	@column()
	public itemId: number;

	@column()
	public amount: number;
}
