import FactoryTypeDataService from 'App/Services/FactoryTypeDataService';
import ItemTypeDataService from 'App/Services/ItemTypeDataService';
import RecipeDataService from 'App/Services/RecipeDataService';
import ShipTypeDataService from 'App/Services/ShipTypeDataService';
import ShopTypeDataService from 'App/Services/ShopTypeDataService';

export default class DataController {

	public async itemTypes() {
		return Object.fromEntries(ItemTypeDataService.getAll().entries());
	}

	public async recipes() {
		return Object.fromEntries(RecipeDataService.getAll().entries());
	}

	public async factoryTypes() {
		return Object.fromEntries(FactoryTypeDataService.getAll().entries());
	}

	public async shopTypes() {
		return Object.fromEntries(ShopTypeDataService.getAll().entries());
	}

	public async shipTypes() {
		return Object.fromEntries(ShipTypeDataService.getAll().entries());
	}

}
