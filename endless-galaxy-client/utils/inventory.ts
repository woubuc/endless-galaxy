import { Inventory } from '../models/Inventory';

export function totalItems(inventory: Inventory): number {
	let total = 0;
	for (let stack of Object.values(inventory)) {
		total += stack.amount;
	}
	return total;
}

export function contains(inventory: Inventory, contains: Record<string, number>): boolean {
	for (let [id, amount] of Object.entries(contains)) {
		if (inventory[id] == undefined || inventory[id].amount < amount) {
			return false;
		}
	}

	return true;
}
