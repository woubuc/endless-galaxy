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
			apples: 0.077 * this.population,
			bacon: 0.081 * this.population,
			bread: 0.101 * this.population,
			carrots: 0.098 * this.population,
			concrete: 0.019 * this.population,
			construction_material: 0.026 * this.population,
			chicken_meat: 0.051 * this.population,
			corn: 0.05 * this.population,
			eggs: 0.073 * this.population,
			magazine: 0.059 * this.population,
			milk: 0.061 * this.population,
			peanuts: 0.042 * this.population,
			plank: 0.021 * this.population,
			potatoes: 0.047 * this.population,
			processed_food: 0.345 * this.population,
			petroleum: 0.119 * this.population,
			spinach: 0.038 * this.population,
			fish: 0.102 * this.population,
		};

		if (this.population > 2_000) {
			Object.assign(demands, {
				baguette: 0.026 * this.population,
				bananas: 0.057 * this.population,
				beauty_product: 0.081 * this.population,
				bread: 0.097 * this.population,
				book: 0.036 * this.population,
				cashews: 0.03 * this.population,
				cherries: 0.041 * this.population,
				cheese: 0.094 * this.population,
				eggplant: 0.057 * this.population,
				electronics: 0.094 * this.population,
				hazelnuts: 0.011 * this.population,
				lettuce: 0.021 * this.population,
				orange_juice: 0.054 * this.population,
				oranges: 0.027 * this.population,
				paper: 0.096 * this.population,
				rope: 0.01 * this.population,
				steak: 0.038 * this.population,
				tool: 0.072 * this.population,
				tomato: 0.051 * this.population,
			});
		}

		if (this.population > 5_000) {
			Object.assign(demands, {
				avocado: 0.031 * this.population,
				candy: 0.067 * this.population,
				croissant: 0.061 * this.population,
				construction_tool: 0.038 * this.population,
				flour: 0.024 * this.population,
				grapes: 0.023 * this.population,
				pears: 0.041 * this.population,
				processor: 0.022 * this.population,
				robot: 0.007 * this.population,
				seed: 0.012 * this.population,
				sugar: 0.03 * this.population,
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
