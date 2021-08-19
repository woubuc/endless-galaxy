import ShipTypeData from 'App/Models/ShipTypeData';
import ShipTypeDataBuilder from 'App/Models/ShipTypeDataBuilder';
import DataService from 'App/Services/DataService';

export type ShipTypeId = string;

class ShipTypeDataService extends DataService<ShipTypeId, ShipTypeData, ShipTypeDataBuilder> {
	public readonly typeName = 'ship';
	protected readonly BuilderClass = ShipTypeDataBuilder;
}

export default new ShipTypeDataService();
