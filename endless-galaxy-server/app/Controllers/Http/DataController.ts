import ItemTypeService from 'App/Services/ItemTypeService';
import ShipTypeService from 'App/Services/ShipTypeService';

export default class DataController {

	public async itemTypes() {
		return ItemTypeService.getAll();
	}

	public async shipTypes() {
		return ShipTypeService.getAll();
	}

}
