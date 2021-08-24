import { Inventory } from './Inventory';

export default interface Ship {
	id: number;
	user_id: number;

	name: string;
	ship_type: string;

	planet_id: number;

	inventory: Inventory;

	movement_minutes: number | null;
	movement_minutes_remaining: number | null;
}
