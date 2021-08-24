import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Market from 'App/Models/Market';
import Planet from 'App/Models/Planet';
import Shipyard from 'App/Models/Shipyard';
import { customAlphabet } from 'nanoid';

export default class PlanetSeeder extends BaseSeeder {
	public async run() {
		let id = customAlphabet('XZWSTUMCNQ', 2);

		function pop(chance: number, min: number, max: number): number {
			if (Math.random() < chance) {
				return min + Math.round(Math.random() * (max - min));
			} else {
				return 0;
			}
		}

		function planetType(): string {
			let n = Math.random();
			if (n < 0.2) {
				return 'earth_like';
			}
			if (n < 0.5) {
				return 'desert';
			}
			if (n < 0.7) {
				return 'water';
			}
			return 'gas';
		}

		let planets: Partial<Planet>[] = [
			{ id: 1, name: 'AX-1', x: 0, y: 2, z: -3, population: pop(1, 2_000, 15_000), planetType: 'water' },
			{ id: 2, name: 'AX-2', x: -1, y: 8, z: -6, population: pop(1, 10_000, 40000), planetType: 'earth_like' },
			{ id: 3, name: 'AX-3', x: 3, y: -2, z: 2, planetType: 'desert' },
		];
		let shipyards: Partial<Shipyard>[] = [
			{ id: 1, planetId: 2, inventory: {} },
		];
		let markets: Partial<Market>[] = [
			{ id: 1, planetId: 1, marketRates: {} },
			{ id: 2, planetId: 2, marketRates: {} },
		];

		for (let i = 4; i <= 100; i++) {
			let population = pop(0.3, 0, 10_000);
			planets.push({
				id: i,
				name: `${ await id() }-${ Math.floor(Math.random() * 9) + 1 }`,
				planetType: planetType(),
				x: Math.round(Math.random() * 1_000) - 500,
				y: Math.round(Math.random() * 1_000) - 500,
				z: Math.round(Math.random() * 1_000) - 500,
				population,
			});
			if (population > 0 && Math.random() < 0.2) {
				shipyards.push({ id: shipyards.length + 1, planetId: i, inventory: {} });
			}
			if (population > 0) {
				markets.push({ id: markets.length + 1, planetId: i, marketRates: {} });
			}
		}

		await Planet.fetchOrCreateMany('id', planets);
		await Shipyard.fetchOrCreateMany('id', shipyards);
		await Market.fetchOrCreateMany('id', markets);
	}
}
