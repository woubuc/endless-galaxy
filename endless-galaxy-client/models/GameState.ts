export default interface GameState {
	minute: number;
	hour: number;
	day: number;
	week: number;
	month: number;
	year: number;

	last_tick: number;
	next_tick: number;

	last_hour: number;
	next_hour: number;
}
