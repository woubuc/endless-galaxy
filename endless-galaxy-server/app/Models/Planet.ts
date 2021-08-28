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

	@column()
	public demandRate: number = 500;

	@column()
	public demandTooExpensive: boolean = false;

	public get populationDemandsPerHour(): Record<ItemTypeId, number> {
		if (this.population === 0) {
			return {};
		}

		return {
			apples: 0.277 * this.population,
			avocado: 0.231 * this.population,
			bacon: 0.281 * this.population,
			baguette: 0.226 * this.population,
			bananas: 0.257 * this.population,
			beauty_product: 0.281 * this.population,
			book: 0.236 * this.population,
			bread: 0.301 * this.population,
			candy: 0.267 * this.population,
			carrots: 0.298 * this.population,
			cashews: 0.23 * this.population,
			cheese: 0.294 * this.population,
			cherries: 0.241 * this.population,
			chicken_meat: 0.251 * this.population,
			concrete: 0.219 * this.population,
			construction_material: 0.226 * this.population,
			construction_tool: 0.238 * this.population,
			corn: 0.25 * this.population,
			croissant: 0.261 * this.population,
			eggplant: 0.257 * this.population,
			eggs: 0.273 * this.population,
			electronics: 0.294 * this.population,
			fish: 0.302 * this.population,
			flour: 0.224 * this.population,
			grapes: 0.223 * this.population,
			hazelnuts: 0.211 * this.population,
			lettuce: 0.221 * this.population,
			magazine: 0.259 * this.population,
			milk: 0.261 * this.population,
			orange_juice: 0.254 * this.population,
			oranges: 0.227 * this.population,
			paper: 0.296 * this.population,
			peanuts: 0.242 * this.population,
			pears: 0.241 * this.population,
			petroleum: 0.319 * this.population,
			plank: 0.221 * this.population,
			potatoes: 0.247 * this.population,
			processed_food: 0.545 * this.population,
			processor: 0.222 * this.population,
			robot: 0.207 * this.population,
			rope: 0.21 * this.population,
			seed: 0.272 * this.population,
			spinach: 0.238 * this.population,
			steak: 0.238 * this.population,
			sugar: 0.23 * this.population,
			tomato: 0.251 * this.population,
			tool: 0.272 * this.population,
		};
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
