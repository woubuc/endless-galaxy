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
			apples: 0.377 * this.population,
			avocado: 0.331 * this.population,
			bacon: 0.381 * this.population,
			baguette: 0.326 * this.population,
			bananas: 0.357 * this.population,
			beauty_product: 0.381 * this.population,
			book: 0.336 * this.population,
			bread: 0.401 * this.population,
			candy: 0.267 * this.population,
			carrots: 0.398 * this.population,
			cashews: 0.33 * this.population,
			cheese: 0.394 * this.population,
			cherries: 0.341 * this.population,
			chicken_meat: 0.351 * this.population,
			concrete: 0.299 * this.population,
			construction_material: 0.226 * this.population,
			construction_tool: 0.238 * this.population,
			corn: 0.35 * this.population,
			croissant: 0.301 * this.population,
			eggplant: 0.357 * this.population,
			eggs: 0.373 * this.population,
			electronics: 0.494 * this.population,
			fish: 0.402 * this.population,
			flour: 0.324 * this.population,
			grapes: 0.323 * this.population,
			hazelnuts: 0.311 * this.population,
			lettuce: 0.321 * this.population,
			magazine: 0.359 * this.population,
			milk: 0.361 * this.population,
			orange_juice: 0.354 * this.population,
			oranges: 0.327 * this.population,
			paper: 0.396 * this.population,
			peanuts: 0.342 * this.population,
			pears: 0.341 * this.population,
			petroleum: 0.419 * this.population,
			plank: 0.321 * this.population,
			potatoes: 0.347 * this.population,
			processed_food: 0.645 * this.population,
			processor: 0.322 * this.population,
			robot: 0.237 * this.population,
			rope: 0.28 * this.population,
			seed: 0.372 * this.population,
			spinach: 0.338 * this.population,
			steak: 0.338 * this.population,
			sugar: 0.33 * this.population,
			tomato: 0.351 * this.population,
			tool: 0.372 * this.population,
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
