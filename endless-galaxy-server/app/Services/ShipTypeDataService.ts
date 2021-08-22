import DataPicker from '@woubuc/data-picker';
import ShipTypeData from 'App/Models/ShipTypeData';
import DataService from 'App/Services/DataService';

export type ShipTypeId = string;

class ShipTypeDataService extends DataService<ShipTypeId, ShipTypeData> {
	public readonly typeName = 'ship';

	protected readonly dataPath: string = 'data/ships';

	protected consume(id: ShipTypeId, data: DataPicker): ShipTypeData {
		let resources = data.getRawObject('resources') as Record<string, number>;

		return {
			id,
			capacity: data.getNumber('capacity'),
			speed: data.getNumber('speed'),
			runCost: data.getNumber('run_cost'),

			resources,
			totalResources: Array.from(Object.values(resources)).reduce((acc, i) => acc + i, 0),
		};
	}
}

export default new ShipTypeDataService();
