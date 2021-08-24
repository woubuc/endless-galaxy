import { ItemTypeId } from 'App/Services/ItemTypeDataService';

export type PlanetTypeId = string;

export default interface PlanetTypeData {
	id: PlanetTypeId;

	buildCostModifier: number;
	recipeOutputModifiers: Record<ItemTypeId, number>;
	factories: string[];
}
