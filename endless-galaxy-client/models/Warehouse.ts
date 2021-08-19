import { Inventory } from './Inventory';

export default interface Warehouse {
	id: number;
	planet_id: number;
	inventory: Inventory;
	size: number;
}
