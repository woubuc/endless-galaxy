export default interface Ship {
	id: number;
	user_id: number;

	name: string;

	planet_id: number;
	movement_distance_remaining: number;
}
