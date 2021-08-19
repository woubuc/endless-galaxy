import FactoryTypeData, { FactoryTypeId } from 'App/Models/FactoryTypeData';
import TypeBuilder from 'App/Models/TypeBuilder';
import RecipeDataService, { RecipeId } from 'App/Services/RecipeDataService';

export default class FactoryTypeDataBuilder extends TypeBuilder<FactoryTypeId, FactoryTypeData> {
	protected data: Partial<FactoryTypeData> = {
		recipes: [],
	};

	public staff(staff: number): FactoryTypeDataBuilder {
		this.data.staff = staff;
		return this;
	}

	public price(price: number): FactoryTypeDataBuilder {
		this.data.price = price;
		return this;
	}

	public recipe(...recipes: RecipeId[]) {
		for (let recipe of recipes) {
			RecipeDataService.get(recipe);
			this.data.recipes!.push(recipe);
		}
		return this;
	}

	protected validate(): void {
		this.requireKey('staff');
		this.requireKey('price');
	}

}
