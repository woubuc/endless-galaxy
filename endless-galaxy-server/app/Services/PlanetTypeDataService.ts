import DataPicker from '@woubuc/data-picker';
import { FactoryTypeId } from 'App/Models/FactoryTypeData';
import PlanetTypeData, { PlanetTypeId } from 'App/Models/PlanetTypeData';
import DataService from 'App/Services/DataService';
import FactoryTypeDataService from 'App/Services/FactoryTypeDataService';
import ItemTypeDataService, { ItemTypeId } from 'App/Services/ItemTypeDataService';

class PlanetTypeDataService extends DataService<PlanetTypeId, PlanetTypeData> {
	public readonly typeName = 'recipe';

	protected readonly dataPath: string = 'data/planet_types';

	protected consume(id: PlanetTypeId, data: DataPicker): PlanetTypeData {
		let recipeOutputModifiers = data.getRawObject('recipe_output_modifiers', {}) as Record<ItemTypeId, number>;
		for (let id of Object.keys(recipeOutputModifiers)) {
			ItemTypeDataService.get(id);
		}

		let factories = data.getArray('factories', []) as FactoryTypeId[];
		for (let id of factories) {
			FactoryTypeDataService.get(id);
		}

		let scavenge = data.getArray('scavenge', []) as ItemTypeId[];
		for (let id of scavenge) {
			ItemTypeDataService.get(id);
		}

		return {
			id,
			buildCostModifier: data.getNumber('build_cost_modifier', 1),
			recipeOutputModifiers,
			factories,
			scavenge,
		};
	}
}

export default new PlanetTypeDataService();
