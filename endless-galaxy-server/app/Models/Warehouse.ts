import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import { Inventory } from 'App/Models/Inventory';
import Planet from 'App/Models/Planet';
import User, { UserId } from 'App/Models/User';

export default class Warehouse extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public userId: UserId;

	@belongsTo(() => User)
	public readonly user: BelongsTo<typeof User>;

	@column()
	public planetId: number;

	@belongsTo(() => Planet)
	public readonly planet: BelongsTo<typeof Planet>;

	@column()
	public inventory: Inventory = {};

	@column()
	public size: number;
}
