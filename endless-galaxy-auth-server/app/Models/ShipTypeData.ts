import ItemTypeService, { ItemTypeId } from 'App/Services/ItemTypeService';
import ShipTypeService from 'App/Services/ShipTypeService';

export default class ShipTypeData {
	id: string;
	/**
	 * Volume of cargo this ship can hold
	 */
	capacity: number;

	/**
	 * Speed of the ship, in tiles per day
	 */
	speed: number;

	/**
	 * Resource cost of the ship
	 */
	resources: Record<string, number>;

	/**
	 * Total amount of resources this ship needs
	 */
	totalResources: number;

	/**
	 * Running cost of this ship per day
	 */
	runCost: number;
}

export class ShipTypeDataBuilder {

	private service: typeof ShipTypeService;

	private data: Partial<ShipTypeData> = {
		resources: {},
		totalResources: 0,
	};

	public constructor(service: typeof ShipTypeService, id: string) {
		this.service = service;
		this.data.id = id;
	}

	public capacity(capacity: number): ShipTypeDataBuilder {
		this.data.capacity = capacity;
		return this;
	}

	public speed(speed: number): ShipTypeDataBuilder {
		this.data.speed = speed;
		return this;
	}

	public buildCost(resource: ItemTypeId, amount: number): ShipTypeDataBuilder {
		ItemTypeService.get(resource);
		if (this.data.resources![resource] != undefined) {
			throw new Error(`Duplicate resource ${ resource } in ship ${ this.data.id }`);
		}
		this.data.resources![resource] = amount;
		this.data.totalResources! += amount;
		return this;
	}

	public runCost(amount: number): ShipTypeDataBuilder {
		this.data.runCost = amount;
		return this;
	}

	public add() {
		this.requireKey('capacity');
		this.requireKey('speed');
		this.requireKey('runCost');
		this.service.add(this.data as ShipTypeData);
	}

	private requireKey(key: keyof ShipTypeData) {
		if (this.data[key] == undefined) {
			throw new Error(`Missing property ${ key } in ship ${ this.data.id }`);
		}
	}

}
