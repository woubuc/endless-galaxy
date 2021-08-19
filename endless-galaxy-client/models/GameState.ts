export default interface GameState {
	day: number;
	year: number;
	week: number;
	date: number;

	last_tick: number;
	next_tick: number;
}
