import RecipeData from 'App/Models/RecipeData';
import TypeBuilder from 'App/Models/TypeBuilder';
import { ItemTypeId } from 'App/Services/ItemTypeDataService';
import { ShipTypeId } from 'App/Services/ShipTypeDataService';

export default class RecipeDataBuilder extends TypeBuilder<ShipTypeId, RecipeData> {
	protected data: Partial<RecipeData> = {
		input: {},
		output: {},
		hours: 1,
	};

	public hours(hours: number): RecipeDataBuilder {
		this.data.hours = hours;
		return this;
	}

	public days(days: number): RecipeDataBuilder {
		this.data.hours = days * 24;
		return this;
	}

	public weeks(weeks: number): RecipeDataBuilder {
		this.data.hours = weeks * 7 * 24;
		return this;
	}

	public input(item: ItemTypeId, amount: number): RecipeDataBuilder {
		this.addItemTo(this.data.input!, item, amount);
		return this;
	}

	public output(item: ItemTypeId, amount: number): RecipeDataBuilder {
		this.addItemTo(this.data.output!, item, amount);
		return this;
	}

	protected validate(): void {
		this.requireKey('hours');
	}
}
