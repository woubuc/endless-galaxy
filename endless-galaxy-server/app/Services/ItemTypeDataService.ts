import DataPicker from '@woubuc/data-picker';
import ItemTypeData from 'App/Models/ItemTypeData';
import DataService from 'App/Services/DataService';

export type ItemTypeId = string;

class ItemTypeDataService extends DataService<ItemTypeId, ItemTypeData> {
	public readonly typeName = 'item';

	protected readonly dataPath: string = 'data/items';

	protected consume(id: ItemTypeId, data: DataPicker): ItemTypeData {
		return {
			id,
			volume: data.getNumber('volume'),
		};
	}
}

export default new ItemTypeDataService();
