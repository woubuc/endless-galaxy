import ItemTypeService from 'App/Services/ItemTypeService';
import ShipTypeService from 'App/Services/ShipTypeService';

export default class DataController {

	public async itemTypes() {
		return Object.fromEntries(ItemTypeService.getAll().entries());
	}

	public async shipTypes() {
		return Object.fromEntries(ShipTypeService.getAll().entries());
	}

}
