export default interface Ship {
	id: number;
	user_id: number;

	name: string;

	planet_id: number;
	target_planet_id?: number;
	target_progress: number;
}
