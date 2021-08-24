import Database from '@ioc:Adonis/Lucid/Database';
import { afterSave, BaseModel, column, computed, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm';
import Market from 'App/Models/Market';
import Ship from 'App/Models/Ship';
import Shipyard from 'App/Models/Shipyard';
import FeedService from 'App/Services/FeedService';
import { ItemTypeId } from 'App/Services/ItemTypeDataService';

export type PlanetId = number;

export default class Planet extends BaseModel {
	@column({ isPrimary: true })
	public id: PlanetId;

	@column()
	public name: string;

	@column()
	public planetType: string;

	@column()
	public x: number;

	@column()
	public y: number;

	@column()
	public z: number;

	@column()
	public population: number;

	@computed({ serializeAs: 'population_demands' })
	public get populationDemandedItems(): ItemTypeId[] {
		return Array.from(Object.keys(this.populationDemandsPerHour));
	}

	public get populationDemandsPerHour(): Record<ItemTypeId, number> {
		if (this.population === 0) {
			return {};
		}
		
		let demands: Record<ItemTypeId, number> = {
			concrete: Math.floor(0.019 * this.population),
			construction_material: Math.floor(0.026 * this.population),
			magazine: Math.floor(0.059 * this.population),
			plank: Math.floor(0.021 * this.population),
			fresh_food: Math.floor(0.189 * this.population),
			processed_food: Math.floor(0.345 * this.population),
			petroleum: Math.floor(0.119 * this.population),
		};

		if (this.population > 2_000) {
			Object.assign(demands, {
				beauty_products: Math.floor(0.081 * this.population),
				bread: Math.floor(0.097 * this.population),
				book: Math.floor(0.036 * this.population),
				electronics: Math.floor(0.094 * this.population),
				paper: Math.floor(0.096 * this.population),
				tools: Math.floor(0.072 * this.population),
			});
		}

		if (this.population > 5_000) {
			Object.assign(demands, {
				candy: Math.floor(0.067 * this.population),
				construction_tools: Math.floor(0.038 * this.population),
				flour: Math.floor(0.024 * this.population),
				processor: Math.floor(0.022 * this.population),
				robot: Math.floor(0.007 * this.population),
				seed: Math.floor(0.012 * this.population),
			})
		}

		return demands;
	}

	@hasOne(() => Shipyard)
	public shipyard: HasOne<typeof Shipyard>;

	@hasOne(() => Market)
	public market: HasOne<typeof Market>;

	@hasMany(() => Ship)
	public ships: HasMany<typeof Ship>;

	@afterSave()
	public static async afterSave(planet: Planet) {
		let rows = await Database.query()
			.select('user_id')
			.from('user_discovered_planets')
			.where('planet_id', planet.id)
			.exec();

		for (let row of rows) {
			await FeedService.emitPlanet(row.user_id, planet);
		}
	}
}
