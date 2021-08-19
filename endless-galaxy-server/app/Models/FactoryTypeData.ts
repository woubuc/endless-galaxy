export type FactoryTypeId = string;

export default interface FactoryTypeData {
	id: FactoryTypeId;

	/**
	 * Recipe IDs this factory can make
	 */
	recipes: string[];

	/**
	 * Amount of staff per level
	 */
	staff: number;

	/**
	 * Construction price per level
	 */
	price: number;
}
