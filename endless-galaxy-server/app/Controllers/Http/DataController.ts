import { GAME_MINUTES_PER_TICK, SECONDS_PER_TICK, STAFF_COST_HOURLY } from 'App/Constants';
import FactoryTypeDataService from 'App/Services/FactoryTypeDataService';
import ItemTypeDataService from 'App/Services/ItemTypeDataService';
import PlanetTypeDataService from 'App/Services/PlanetTypeDataService';
import RecipeDataService from 'App/Services/RecipeDataService';
import ShipTypeDataService from 'App/Services/ShipTypeDataService';
import ShopTypeDataService from 'App/Services/ShopTypeDataService';

export default class DataController {

	public async data() {
		return {
			staffWages: STAFF_COST_HOURLY,
			secondsPerTick: SECONDS_PER_TICK,
			gameMinutesPerTick: GAME_MINUTES_PER_TICK,
			itemTypes: Object.fromEntries(ItemTypeDataService.getAll().entries()),
			factoryTypes: Object.fromEntries(FactoryTypeDataService.getAll().entries()),
			planetTypes: Object.fromEntries(PlanetTypeDataService.getAll().entries()),
			recipes: Object.fromEntries(RecipeDataService.getAll().entries()),
			shopTypes: Object.fromEntries(ShopTypeDataService.getAll().entries()),
			shipTypes: Object.fromEntries(ShipTypeDataService.getAll().entries()),
		};
	}
}
