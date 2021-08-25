import { afterSave, BaseModel, beforeSave, belongsTo, BelongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm';
import { Inventory } from 'App/Models/Inventory';
import Planet, { PlanetId } from 'App/Models/Planet';
import User, { UserId } from 'App/Models/User';
import FeedService from 'App/Services/FeedService';
import { cleanup } from 'App/Util/InventoryUtils';

export type WarehouseId = number;

export const WAREHOUSE_CAPACITY_PER_SIZE: number = 6_000;

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

	@computed()
	public get capacity(): number {
		return this.size * WAREHOUSE_CAPACITY_PER_SIZE;
	}

	@beforeSave()
	public static async beforeSave(warehouse: Warehouse) {
		warehouse.inventory = cleanup(warehouse.inventory);
	}

	@afterSave()
	public static async afterSave(warehouse: Warehouse) {
		await FeedService.emitWarehouse(warehouse);
	}
}
