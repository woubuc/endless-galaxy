import { ItemTypeId } from './ItemTypeData';

export type RecipeDataId = string;

export default interface RecipeData {
	id: RecipeDataId;
	input: Record<ItemTypeId, number>;
	output: Record<ItemTypeId, number>;
	hours: number;
}
