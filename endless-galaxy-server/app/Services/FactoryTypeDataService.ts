import DataPicker from '@woubuc/data-picker';
import FactoryTypeData, { FactoryTypeId } from 'App/Models/FactoryTypeData';
import DataService from 'App/Services/DataService';
import RecipeDataService, { RecipeId } from 'App/Services/RecipeDataService';

class FactoryTypeDataService extends DataService<FactoryTypeId, FactoryTypeData> {
	public readonly typeName: string = 'factory';

	protected readonly dataPath: string = 'data/factories';

	protected consume(id: FactoryTypeId, data: DataPicker): FactoryTypeData {
		let recipes = data.getArray('recipes') as RecipeId[];
		for (let id of recipes) {
			RecipeDataService.get(id);
		}

		return {
			id,
			staff: data.getNumber('staff'),
			price: data.getNumber('price'),
			recipes,
		};
	}
}

export default new FactoryTypeDataService();
