import { afterSave, BaseModel, belongsTo, BelongsTo, column, beforeSave } from '@ioc:Adonis/Lucid/Orm';
import { Inventory } from 'App/Models/Inventory';
import Planet, { PlanetId } from 'App/Models/Planet';
import User, { UserId } from 'App/Models/User';
import FeedService from 'App/Services/FeedService';
import { cleanup } from 'App/Util/InventoryUtils';

export type ShipId = number;

export default class Ship extends BaseModel {
	@column({ isPrimary: true })
	public id: ShipId;

	@column()
	public name: string | null;

	@column()
	public shipType: string;

	@column()
	public inventory: Inventory = {};

	@column()
	public userId: UserId;

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>;

	@column()
	public planetId: PlanetId;

	@belongsTo(() => Planet)
	public planet: BelongsTo<typeof Planet>;

	@column()
	public movementMinutes: number | null;

	@column()
	public movementMinutesRemaining: number | null;

	@beforeSave()
	public static async beforeSave(ship: Ship) {
		ship.inventory = cleanup(ship.inventory);
	}

	@afterSave()
	public static async afterSave(ship: Ship) {
		await FeedService.emitShip(ship);
	}
}

