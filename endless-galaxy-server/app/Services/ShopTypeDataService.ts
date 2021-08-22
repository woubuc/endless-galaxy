import DataPicker from '@woubuc/data-picker';
import ShopTypeData, { ShopTypeId } from 'App/Models/ShopTypeData';
import DataService from 'App/Services/DataService';
import { ItemTypeId } from 'App/Services/ItemTypeDataService';

class ShopTypeDataService extends DataService<ShopTypeId, ShopTypeData> {
	public readonly typeName: string = 'shop';

	protected readonly dataPath: string = 'data/shops';

	protected consume(id: ShopTypeId, data: DataPicker): ShopTypeData {
		return {
			id,
			shelves: data.getNumber('shelves'),
			items: data.getArray('items') as ItemTypeId[],
			price: data.getNumber('price'),
			staff: data.getNumber('staff'),
		};
	}
}

export default new ShopTypeDataService();
