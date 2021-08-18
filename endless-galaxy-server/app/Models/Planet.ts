import { BaseModel, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm';
import Market from 'App/Models/Market';
import Ship from 'App/Models/Ship';
import Shipyard from 'App/Models/Shipyard';

export type PlanetId = number;

export default class Planet extends BaseModel {
	@column({ isPrimary: true })
	public id: PlanetId;

	@column()
	public name: string;

	@column()
	public x: number;

	@column()
	public y: number;

	@column()
	public z: number;

	@column()
	public population: number;

	@hasOne(() => Shipyard)
	public shipyard: HasOne<typeof Shipyard>;

	@hasOne(() => Market)
	public market: HasOne<typeof Market>;

	@hasMany(() => Ship)
	public ships: HasMany<typeof Ship>;
}
