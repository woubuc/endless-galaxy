import AutoTraderConfig from './AutoTraderConfig';
import { Inventory } from './Inventory';
import { ItemTypeId } from './ItemTypeData';

export default interface Warehouse {
	id: number;
	planet_id: number;
	inventory: Inventory;
	size: number;
	capacity: number;
	auto_trader: Record<ItemTypeId, AutoTraderConfig>;
}
