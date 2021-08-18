import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import Ship from 'App/Models/Ship';

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

	@hasMany(() => Ship)
	public ships: HasMany<typeof Ship>;
}
