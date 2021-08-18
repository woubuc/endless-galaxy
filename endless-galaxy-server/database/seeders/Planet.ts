import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Planet from 'App/Models/Planet';
import Shipyard from 'App/Models/Shipyard';
import { customAlphabet } from 'nanoid';

export default class PlanetSeeder extends BaseSeeder {
	public async run() {
		let id = customAlphabet('XZWSTUMCNQ', 2);

		function pop(chance: number, min: number, max: number) {
			if (Math.random() < chance) {
				return min + Math.round(Math.random() * (max - min));
			} else {
				return 0;
			}
		}

		let planets: Partial<Planet>[] = [
			{ id: 1, name: 'AX-1', x: 0, y: 2, z: -3, population: pop(1, 2_000, 15_000) },
			{ id: 2, name: 'AX-2', x: -1, y: 8, z: -6, population: pop(1, 10_000, 40000) },
			{ id: 3, name: 'AX-3', x: 3, y: -2, z: 2 },
		];
		let shipyards: Partial<Shipyard>[] = [
			{ id: 1, planetId: 2, inventory: {} },
		];

		for (let i = 4; i <= 100; i++) {
			planets.push({
				id: i,
				name: `${ await id() }-${ Math.floor(Math.random() * 9) + 1 }`,
				x: Math.round(Math.random() * 1_000) - 500,
				y: Math.round(Math.random() * 1_000) - 500,
				z: Math.round(Math.random() * 1_000) - 500,
				population: pop(0.3, 0, 10_000),
			});
			if (Math.random() < 0.1) {
				shipyards.push({ id: shipyards.length + 1, planetId: i, inventory: {} });
			}
		}

		await Planet.fetchOrCreateMany('id', planets);
		await Shipyard.fetchOrCreateMany('id', shipyards);
	}
}
