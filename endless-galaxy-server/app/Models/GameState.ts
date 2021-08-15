import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm';

const SECONDS_BETWEEN_DAYS: number = 30;

export default class GameState extends BaseModel {
	public static table = 'game_state';

	@column({ isPrimary: true })
	public id: number;

	@column()
	public day: number;

	@column()
	public hour: number;

	@column()
	public lastTick: number;

	@computed({ serializeAs: 'next_tick' })
	public get nextTick(): number {
		return this.lastTick + SECONDS_BETWEEN_DAYS;
	}
}
