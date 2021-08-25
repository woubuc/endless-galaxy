import { FactoryTypeId } from './FactoryTypeData';

export interface Factory {
	id: number;
	user_id: number;
	planet_id: number;
	factory_type: FactoryTypeId;
	recipe?: string;
	hours_remaining?: number;
	repeat: boolean;
	size: number;
}
