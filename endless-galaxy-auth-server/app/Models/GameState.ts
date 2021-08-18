import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm';

export const SECONDS_PER_TICK: number = 10;

export default class GameState extends BaseModel {
	public static table = 'game_state';

	@column({ isPrimary: true })
	public id: number;

	@column()
	public day: number;

	@column()
	public lastTick: number;

	@computed({ serializeAs: 'next_tick' })
	public get nextTick(): number {
		return this.lastTick + SECONDS_PER_TICK;
	}
}
