import { ItemTypeId } from './ItemTypeData';

export default interface Planet {
	id: number;
	name: string;
	planet_type: string;

	x: number;
	y: number;
	z: number;

	population: number;
	population_demands: ItemTypeId[];
	demand_rate: number;
}
