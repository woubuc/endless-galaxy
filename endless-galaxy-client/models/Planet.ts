import Ship from './Ship';

export default interface Planet {
	id: number;
	name: string;

	x: number;
	y: number;
	z: number;

	population: number;
}
