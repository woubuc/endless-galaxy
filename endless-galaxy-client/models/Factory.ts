import { FactoryTypeId } from './FactoryTypeData';

export interface Factory {
	id: number;
	user_id: number;
	planet_id: number;
	factory_type: FactoryTypeId;
	recipe?: string;
	work_remaining?: number;
	size: number;
}
