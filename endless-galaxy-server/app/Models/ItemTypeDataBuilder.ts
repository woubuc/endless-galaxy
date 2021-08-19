import ItemTypeData from 'App/Models/ItemTypeData';
import TypeBuilder from 'App/Models/TypeBuilder';
import { ItemTypeId } from 'App/Services/ItemTypeDataService';

export default class ItemTypeDataBuilder extends TypeBuilder<ItemTypeId, ItemTypeData> {
	public volume(volume: number): ItemTypeDataBuilder {
		this.data.volume = volume;
		return this;
	}

	protected validate(): void {
		this.requireKey('volume');
	}

}
