import { Inventory } from 'App/Models/Inventory';
import { ItemTypeId } from 'App/Services/ItemTypeDataService';

export function add(inventory: Inventory, add: Inventory) {
	for (let [id, stack] of Object.entries(add)) {
		if (inventory[id] == undefined) {
			inventory[id] = stack;
			continue;
		}

		let amount = inventory[id].amount + stack.amount;
		let value = Math.round(((inventory[id].value * inventory[id].amount) + (stack.value * stack.amount)) / amount);

		inventory[id] = { amount, value };
	}
}

export function take(inventory: Inventory, remove: Record<ItemTypeId, number>): false | Inventory {
	if (!contains(inventory, remove)) {
		return false;
	}

	return takeUnchecked(inventory, remove);
}

export function takeUnchecked(inventory: Inventory, remove: Record<ItemTypeId, number>): Inventory {
	let taken: Inventory = {};

	for (let [id, amount] of Object.entries(remove)) {
		if (inventory[id] === undefined) {
			continue;
		}

		inventory[id].amount -= amount;
		taken[id] = {
			amount,
			value: inventory[id].value,
		};

		if (inventory[id].amount === 0) {
			delete inventory[id];
		}
	}

	return taken;
}

export function contains(inventory: Inventory, contains: Record<ItemTypeId, number>): boolean {
	for (let [id, amount] of Object.entries(contains)) {
		if (inventory[id] == undefined || inventory[id].amount < amount) {
			return false;
		}
	}

	return true;
}

export function transfer(from: Inventory, to: Inventory, transfer: Record<ItemTypeId, number>): boolean {
	if (!contains(from, transfer)) {
		return false;
	}

	transferUnchecked(from, to, transfer);
	return true;
}

export function transferUnchecked(from: Inventory, to: Inventory, transfer: Record<ItemTypeId, number>) {
	let stack = takeUnchecked(from, transfer);
	add(to, stack);
}
