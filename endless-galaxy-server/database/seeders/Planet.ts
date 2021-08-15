import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Planet from 'App/Models/Planet';
import { customAlphabet } from 'nanoid';

export default class PlanetSeeder extends BaseSeeder {
	public async run() {
		let id = customAlphabet('XZWSTUMCNQ', 2);

		let planets: Partial<Planet>[] = [
			{ id: 1, name: 'AX-1', x: 0, y: 2, z: -3 },
			{ id: 2, name: 'AX-2', x: -1, y: 8, z: -6 },
			{ id: 3, name: 'AX-3', x: 3, y: -2, z: 2 },
		];

		for (let i = 4; i <= 100; i++) {
			planets.push({
				id: i,
				name: `${ await id() }-${ Math.floor(Math.random() * 9) + 1 }`,
				x: Math.round(Math.random() * 1_000) - 500,
				y: Math.round(Math.random() * 1_000) - 500,
				z: Math.round(Math.random() * 1_000) - 500,
			});
		}

		await Planet.fetchOrCreateMany('id', planets);
	}
}
