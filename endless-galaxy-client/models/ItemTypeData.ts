export type ItemTypeId = string;

export default interface ItemTypeData {
	id: ItemTypeId;

	/**
	 * Volume of 1 unit of this item
	 */
	volume: number;
}
