import Ship from './Ship';

export default interface Planet {
	id: number;
	name: string;

	x: number;
	y: number;
	z: number;

	has_settlement: boolean;
	has_shipyard: boolean;

	ships?: Ship[];
	ships_targeting?: Ship[];
}
