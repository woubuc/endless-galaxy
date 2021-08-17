export default interface ShipyardOrder {
	id: number;
	user_id: number;
	shipyard_id: number;
	ship_type: string;
	work_remaining: number;
	total_work: number;
	placed: Date | string;
}
