import ShipTypeData, { ShipTypeDataBuilder } from 'App/Models/ShipTypeData';
import ItemTypeService from 'App/Services/ItemTypeService';

export type ShipTypeId = string;

class ShipTypeService {
	private shipTypes = new Map<ShipTypeId, ShipTypeData>();

	public get count(): number {
		return this.shipTypes.size;
	}

	public create(id: ShipTypeId): ShipTypeDataBuilder {
		if (this.shipTypes.has(id)) {
			throw new Error(`Duplicate ship type ID: ${ id }`);
		}

		return new ShipTypeDataBuilder(this, id);
	}

	public add(ship: ShipTypeData) {
		if (this.shipTypes.has(ship.id)) {
			throw new Error(`Duplicate ship type ID: ${ ship.id }`);
		}

		for (let resourceId of Object.keys(ship.resources)) {
			ItemTypeService.get(resourceId);
		}

		this.shipTypes.set(ship.id, ship);
	}

	public get(id: ShipTypeId): ShipTypeData {
		let ship = this.shipTypes.get(id);
		if (ship == undefined) {
			throw new ReferenceError(`Invalid ship type ID: ${ id }`);
		}

		return ship;
	}

	public getAll(): Map<ShipTypeId, ShipTypeData> {
		return this.shipTypes;
	}
}

export default new ShipTypeService();
