export type ShipTypeId = string;

export default interface ShipTypeData {
	id: ShipTypeId;
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
	 * Daily running cost of the ship
	 */
	runCost: number;
}
