import DataService from 'App/Services/DataService';
import ItemTypeDataService, { ItemTypeId } from 'App/Services/ItemTypeDataService';

export default abstract class TypeBuilder<IdType extends string, DataType extends { id: IdType }> {
	protected data: Partial<DataType> = {};

	public constructor(
		private readonly service: DataService<IdType, DataType, any>,
		private readonly id: IdType,
		private readonly alternativeIds: IdType[] = [],
	) { }

	public add(): void {
		this.validate();

		let data = this.data as DataType;
		data.id = this.id;
		this.service.add(data.id, data);

		for (let id of this.alternativeIds) {
			this.service.add(id, data);
		}
	}

	protected abstract validate(): void;

	protected requireKey(key: keyof DataType) {
		if (this.data[key] == undefined) {
			throw new Error(`Missing property ${ key } in ship ${ this.data.id }`);
		}
	}

	protected addItemTo(collection: Record<ItemTypeId, number>, item: ItemTypeId, amount: number) {
		ItemTypeDataService.get(item);
		if (collection[item] != undefined) {
			throw new Error(`Duplicate item in ${ this.service.typeName } ${ this.id }: ${ item }`);
		}
		collection[item] = amount;
	}
}
