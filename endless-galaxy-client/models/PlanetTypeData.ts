import { FactoryTypeId } from './FactoryTypeData';
import { ItemTypeId } from './ItemTypeData';

export type PlanetTypeId = string;

export default interface PlanetTypeData {
	id: PlanetTypeId;

	buildCostModifier: number;
	recipeOutputModifiers: Record<ItemTypeId, number>;
	factories: FactoryTypeId[];
	scavenge: ItemTypeId[];
}
