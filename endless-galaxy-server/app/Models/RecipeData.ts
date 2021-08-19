import { ItemTypeId } from 'App/Services/ItemTypeDataService';

export default interface RecipeData {
	id: string;
	input: Record<ItemTypeId, number>;
	output: Record<ItemTypeId, number>;
	hours: number;
}
