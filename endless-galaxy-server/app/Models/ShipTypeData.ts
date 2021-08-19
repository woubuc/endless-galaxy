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
