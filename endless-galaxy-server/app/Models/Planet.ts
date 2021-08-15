import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import Ship from 'App/Models/Ship';

export default class Planet extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public name: string;

	@column()
	public x: number;

	@column()
	public y: number;

	@column()
	public z: number;

	@hasMany(() => Ship)
	public ships: HasMany<typeof Ship>;

	@hasMany(() => Ship, { foreignKey: 'targetPlanetId' })
	public shipsTargeting: HasMany<typeof Ship>;
}
