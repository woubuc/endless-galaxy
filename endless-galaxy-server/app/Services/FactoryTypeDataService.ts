import FactoryTypeData, { FactoryTypeId } from 'App/Models/FactoryTypeData';
import FactoryTypeDataBuilder from 'App/Models/FactoryTypeDataBuilder';
import DataService from 'App/Services/DataService';

class FactoryTypeDataService extends DataService<FactoryTypeId, FactoryTypeData, FactoryTypeDataBuilder> {
	public readonly typeName: string = 'factory';
	protected readonly BuilderClass = FactoryTypeDataBuilder;
}

export default new FactoryTypeDataService();
