import { afterSave, BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import { Inventory } from 'App/Models/Inventory';
import Planet, { PlanetId } from 'App/Models/Planet';
import User, { UserId } from 'App/Models/User';
import FeedService from 'App/Services/FeedService';

export type WarehouseId = number;

export default class Warehouse extends BaseModel {
	@column({ isPrimary: true })
	public id: WarehouseId;

	@column()
	public userId: UserId;

	@belongsTo(() => User)
	public readonly user: BelongsTo<typeof User>;

	@column()
	public planetId: PlanetId;

	@belongsTo(() => Planet)
	public readonly planet: BelongsTo<typeof Planet>;

	@column()
	public inventory: Inventory = {};

	@column()
	public size: number;

	@afterSave()
	public static async afterSave(warehouse: Warehouse) {
		await FeedService.emitWarehouse(warehouse);
	}
}
