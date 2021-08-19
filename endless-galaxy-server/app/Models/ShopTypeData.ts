export type ShopTypeId = string;

export default interface ShopTypeData {
	id: ShopTypeId;

	/**
	 * Item IDs this shop can sell
	 */
	items: string[];

	/**
	 * Amount of staff per level
	 */
	staff: number;

	/**
	 * Number of different items that can be sold per level
	 */
	shelves: number;

	/**
	 * Construction price per level
	 */
	price: number;
}
