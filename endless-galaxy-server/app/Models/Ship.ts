import { BaseModel, BelongsTo, belongsTo, column, hasOne, HasOne, afterSave } from '@ioc:Adonis/Lucid/Orm';
import { Inventory } from 'App/Models/Inventory';
import Planet, { PlanetId } from 'App/Models/Planet';
import User, { UserId } from 'App/Models/User';
import FeedService from 'App/Services/FeedService';

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

	@hasOne(() => Planet)
	public planet: HasOne<typeof Planet>;

	@column()
	public movementMinutes: number | null;

	@column()
	public movementMinutesRemaining: number | null;

	@afterSave()
	public static async afterSave(ship: Ship) {
		await FeedService.emitShip(ship);
	}
}

