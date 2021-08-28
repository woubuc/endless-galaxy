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
			apples: 0.177 * this.population,
			avocado: 0.131 * this.population,
			bacon: 0.181 * this.population,
			baguette: 0.126 * this.population,
			bananas: 0.157 * this.population,
			beauty_product: 0.181 * this.population,
			book: 0.136 * this.population,
			bread: 0.201 * this.population,
			candy: 0.167 * this.population,
			carrots: 0.198 * this.population,
			cashews: 0.13 * this.population,
			cheese: 0.194 * this.population,
			cherries: 0.141 * this.population,
			chicken_meat: 0.151 * this.population,
			concrete: 0.119 * this.population,
			construction_material: 0.126 * this.population,
			construction_tool: 0.138 * this.population,
			corn: 0.15 * this.population,
			croissant: 0.161 * this.population,
			eggplant: 0.157 * this.population,
			eggs: 0.173 * this.population,
			electronics: 0.194 * this.population,
			fish: 0.202 * this.population,
			flour: 0.124 * this.population,
			grapes: 0.123 * this.population,
			hazelnuts: 0.111 * this.population,
			lettuce: 0.121 * this.population,
			magazine: 0.159 * this.population,
			milk: 0.161 * this.population,
			orange_juice: 0.154 * this.population,
			oranges: 0.127 * this.population,
			paper: 0.196 * this.population,
			peanuts: 0.142 * this.population,
			pears: 0.141 * this.population,
			petroleum: 0.219 * this.population,
			plank: 0.121 * this.population,
			potatoes: 0.147 * this.population,
			processed_food: 0.445 * this.population,
			processor: 0.122 * this.population,
			robot: 0.107 * this.population,
			rope: 0.11 * this.population,
			seed: 0.172 * this.population,
			spinach: 0.138 * this.population,
			steak: 0.138 * this.population,
			sugar: 0.13 * this.population,
			tomato: 0.151 * this.population,
			tool: 0.172 * this.population,
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
