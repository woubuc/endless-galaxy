import ItemTypeData from 'App/Models/ItemTypeData';

export type ItemTypeId = string;

class ItemTypeService {
	private itemTypes = new Map<ItemTypeId, ItemTypeData>();

	public get count(): number {
		return this.itemTypes.size;
	}

	public add(id: ItemTypeId, item: Omit<ItemTypeData, 'id'>) {
		if (this.itemTypes.has(id)) {
			throw new Error('Duplicate item type ID:' + id);
		}

		this.itemTypes.set(id, { ...item, id });
	}

	public get(id: ItemTypeId): ItemTypeData {
		let item = this.itemTypes.get(id);
		if (item == undefined) {
			throw new ReferenceError('Invalid item type ID:' + id);
		}

		return item;
	}

	public getAll(): Map<ItemTypeId, ItemTypeData> {
		return this.itemTypes;
	}
}

export default new ItemTypeService();
