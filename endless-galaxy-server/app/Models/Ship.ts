import { BaseModel, BelongsTo, belongsTo, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm';
import { Inventory } from 'App/Models/Inventory';
import Planet, { PlanetId } from 'App/Models/Planet';
import User, { UserId } from 'App/Models/User';

export default class Ship extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public name: string | null;

	@column()
	public shipType: string;

	@column()
	public inventory: Inventory;

	@column()
	public userId: UserId;

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>;

	@column()
	public planetId: PlanetId;

	@hasOne(() => Planet)
	public planet: HasOne<typeof Planet>;

	@column()
	public movementDistanceRemaining: number | null;
}

