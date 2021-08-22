import DataPicker from '@woubuc/data-picker';
import FactoryTypeData, { FactoryTypeId } from 'App/Models/FactoryTypeData';
import DataService from 'App/Services/DataService';
import { RecipeId } from 'App/Services/RecipeDataService';

class FactoryTypeDataService extends DataService<FactoryTypeId, FactoryTypeData> {
	public readonly typeName: string = 'factory';

	protected readonly dataPath: string = 'data/factories';

	protected consume(id: FactoryTypeId, data: DataPicker): FactoryTypeData {
		return {
			id,
			staff: data.getNumber('staff'),
			price: data.getNumber('price'),
			recipes: data.getArray('recipes') as RecipeId[],
		};
	}
}

export default new FactoryTypeDataService();
