import ShopTypeData, { ShopTypeId } from 'App/Models/ShopTypeData';
import ShopTypeDataBuilder from 'App/Models/ShopTypeDataBuilder';
import DataService from 'App/Services/DataService';

class ShopTypeDataService extends DataService<ShopTypeId, ShopTypeData, ShopTypeDataBuilder> {
	public readonly typeName: string = 'shop';
	protected readonly BuilderClass = ShopTypeDataBuilder;
}

export default new ShopTypeDataService();
