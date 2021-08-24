import { FactoryTypeId } from './FactoryTypeData';
import { ItemTypeId } from './ItemTypeData';

export type PlanetTypeId = string;

export default interface PlanetTypeData {
	id: PlanetTypeId;

	factories: FactoryTypeId[];
	buildCostModifier: number;
	recipeOutputModifiers: Record<ItemTypeId, number>;
}
