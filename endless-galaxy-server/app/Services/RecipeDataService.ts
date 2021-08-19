import RecipeData from 'App/Models/RecipeData';
import RecipeDataBuilder from 'App/Models/RecipeDataBuilder';
import DataService from 'App/Services/DataService';

export type RecipeId = string;

class RecipeDataService extends DataService<RecipeId, RecipeData, RecipeDataBuilder> {
	public readonly typeName = 'ship';
	protected readonly BuilderClass = RecipeDataBuilder;
}

export default new RecipeDataService();
