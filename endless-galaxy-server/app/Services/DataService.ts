import Logger from '@ioc:Adonis/Core/Logger';
import DataPicker from '@woubuc/data-picker';
import { readdir, readFile } from 'fs-extra';
import { basename, join } from 'path';
import yaml from 'yaml';

export default abstract class DataService<IdType extends string, DataType extends { id: IdType }> {

	public abstract readonly typeName: string;

	protected abstract readonly dataPath: string;

	protected types = new Map<IdType, DataType>();

	public async load(): Promise<void> {
		let files = await readdir(this.dataPath);
		for (let filename of files) {
			let id = basename(filename, '.yml') as IdType;

			let filePath = join(this.dataPath, filename);
			Logger.debug('Reading datafile: %s', filePath);

			let contents = await readFile(filePath, 'utf-8');

			let parsed = yaml.parse(contents);
			let item = this.consume(id, new DataPicker(filePath, parsed));
			this.add(id, item);
		}

		Logger.info('Loaded %d %s data files', this.count, this.typeName);
	}

	protected abstract consume(id: IdType, data: DataPicker): DataType;

	public get count(): number {
		return this.types.size;
	}

	private add(id: IdType, data: DataType) {
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
