import ItemTypeData from 'App/Models/ItemTypeData';
import ItemTypeDataBuilder from 'App/Models/ItemTypeDataBuilder';
import DataService from 'App/Services/DataService';

export type ItemTypeId = string;

class ItemTypeDataService extends DataService<ItemTypeId, ItemTypeData, ItemTypeDataBuilder> {
	public readonly typeName = 'item';
	protected readonly BuilderClass = ItemTypeDataBuilder;
}

export default new ItemTypeDataService();
