import ShipTypeData from 'App/Models/ShipTypeData';
import TypeBuilder from 'App/Models/TypeBuilder';
import { ItemTypeId } from 'App/Services/ItemTypeDataService';
import { ShipTypeId } from 'App/Services/ShipTypeDataService';

export default class ShipTypeDataBuilder extends TypeBuilder<ShipTypeId, ShipTypeData> {
	protected data: Partial<ShipTypeData> = {
		resources: {},
		totalResources: 0,
	};

	public capacity(capacity: number): ShipTypeDataBuilder {
		this.data.capacity = capacity;
		return this;
	}

	public speed(speed: number): ShipTypeDataBuilder {
		this.data.speed = speed;
		return this;
	}

	public buildCost(resource: ItemTypeId, amount: number): ShipTypeDataBuilder {
		this.addItemTo(this.data.resources!, resource, amount);
		this.data.totalResources! += amount;
		return this;
	}

	public runCost(amount: number): ShipTypeDataBuilder {
		this.data.runCost = amount;
		return this;
	}

	protected validate(): void {
		this.requireKey('capacity');
		this.requireKey('speed');
		this.requireKey('runCost');
	}
}
