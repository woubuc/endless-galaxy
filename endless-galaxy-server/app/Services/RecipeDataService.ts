import DataPicker from '@woubuc/data-picker';
import RecipeData from 'App/Models/RecipeData';
import DataService from 'App/Services/DataService';
import ItemTypeDataService, { ItemTypeId } from 'App/Services/ItemTypeDataService';

export type RecipeId = string;

class RecipeDataService extends DataService<RecipeId, RecipeData> {
	public readonly typeName = 'recipe';

	protected readonly dataPath: string = 'data/recipes';

	protected consume(id: RecipeId, data: DataPicker): RecipeData {
		let hours = data.getNumber('hours', 0)
			+ data.getNumber('days', 0) * 24
			+ data.getNumber('weeks', 0) * 7 * 24;

		if (hours === 0) {
			hours = 1;
		}

		let input = data.getRawObject('input', {}) as Record<ItemTypeId, number>;
		for (let id of Object.keys(input)) {
			ItemTypeDataService.get(id);
		}

		let output = data.getRawObject('output', {}) as Record<ItemTypeId, number>;
		for (let id of Object.keys(output)) {
			ItemTypeDataService.get(id);
		}

		return { id, hours, input, output };
	}
}

export default new RecipeDataService();
