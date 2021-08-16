import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm';
import Planet from 'App/Models/Planet';
import ShipItemStack from 'App/Models/ShipItemStack';
import User from 'App/Models/User';

export default class Ship extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public name: string;

	@column()
	public userId: number;

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>;

	@column()
	public planetId: number;

	@hasOne(() => Planet)
	public planet: HasOne<typeof Planet>;

	@column()
	public targetPlanetId?: number;

	@hasOne(() => Planet)
	public targetPlanet: HasOne<typeof Planet>;

	@column()
	public targetProgress: number;

	@hasMany(() => ShipItemStack, {})
	public inventory: HasMany<typeof ShipItemStack>;
}
