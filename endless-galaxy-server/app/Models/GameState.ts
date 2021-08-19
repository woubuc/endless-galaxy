import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm';

export const SECONDS_PER_TICK: number = 60 * 5; // 5 irl minutes per in-game day

export const DAYS_IN_YEAR: number = 364;
export const DAYS_IN_WEEK: number = 7;

export default class GameState extends BaseModel {
	public static table = 'game_state';

	@column({ isPrimary: true })
	public id: number;

	@column()
	public day: number;

	@computed()
	public get year(): number {
		return Math.floor(this.day / DAYS_IN_YEAR);
	}

	@computed()
	public get week(): number {
		let yearDays = this.year * DAYS_IN_YEAR;
		return Math.floor((this.day - yearDays) / DAYS_IN_WEEK);
	}

	@computed()
	public get date(): number {
		let yearDays = this.year * DAYS_IN_YEAR;
		let weekDays = this.week * DAYS_IN_WEEK;
		return this.day - yearDays - weekDays;
	}

	@column()
	public lastTick: number;

	@computed({ serializeAs: 'next_tick' })
	public get nextTick(): number {
		return this.lastTick + SECONDS_PER_TICK;
	}
}
