export default interface ShipyardOrder {
	id: number;
	user_id: number;
	shipyard_id: number;
	ship_type: string;
	budget_remaining: number;
	resources_remaining: Record<string, number>;
}
