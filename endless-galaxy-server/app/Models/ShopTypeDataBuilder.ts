import ShopTypeData, { ShopTypeId } from 'App/Models/ShopTypeData';
import TypeBuilder from 'App/Models/TypeBuilder';
import ItemTypeDataService, { ItemTypeId } from 'App/Services/ItemTypeDataService';

export default class ShopTypeDataBuilder extends TypeBuilder<ShopTypeId, ShopTypeData> {
	protected data: Partial<ShopTypeData> = {
		items: [],
	};

	public staff(staff: number): ShopTypeDataBuilder {
		this.data.staff = staff;
		return this;
	}

	public shelves(shelves: number): ShopTypeDataBuilder {
		this.data.shelves = shelves;
		return this;
	}

	public price(price: number): ShopTypeDataBuilder {
		this.data.price = price;
		return this;
	}

	public item(...items: ItemTypeId[]) {
		for (let item of items) {
			ItemTypeDataService.get(item);
			this.data.items!.push(item);
		}
		return this;
	}

	protected validate(): void {
		this.requireKey('staff');
		this.requireKey('shelves');
		this.requireKey('price');
	}

}
