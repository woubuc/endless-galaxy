import DataBuilder from 'App/Models/TypeBuilder';
import { Constructor } from 'type-fest';

export default abstract class DataService<IdType extends string, DataType extends { id: IdType }, Builder extends DataBuilder<IdType, DataType>> {

	public abstract readonly typeName: string;
	protected abstract readonly BuilderClass: Constructor<Builder>;

	protected types = new Map<IdType, DataType>();

	public get count(): number {
		return this.types.size;
	}

	public create(id: IdType, ...alternativeIds: IdType[]): Builder {
		return new this.BuilderClass(this, id, alternativeIds);
	}

	public add(id: IdType, data: DataType) {
		if (this.types.has(id)) {
			throw new Error(`Duplicate ${ this.typeName } type ID:${ id }`);
		}

		this.types.set(id, data);
	}

	public get(id: IdType): DataType {
		let data = this.types.get(id);
		if (data == undefined) {
			throw new ReferenceError(`Invalid ${ this.typeName } type ID:${ id }`);
		}

		return data;
	}

	public getAll(): Map<IdType, DataType> {
		return this.types;
	}
}
