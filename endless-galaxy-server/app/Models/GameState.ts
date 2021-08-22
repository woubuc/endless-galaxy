import { afterSave, BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm';
import { SECONDS_PER_TICK } from 'App/Constants';
import FeedService from 'App/Services/FeedService';

export default class GameState extends BaseModel {
	public static table = 'game_state';

	@column({ isPrimary: true })
	public id: number;

	@column()
	public minute: number;

	@column()
	public hour: number;

	@column()
	public day: number;

	@column()
	public week: number;

	@column()
	public month: number;

	@column()
	public year: number;

	@column()
	public lastTick: number;

	@computed({ serializeAs: 'next_tick' })
	public get nextTick(): number {
		return this.lastTick + SECONDS_PER_TICK;
	}

	@computed({ serializeAs: 'last_hour' })
	public get lastHour(): number {
		let ticksSinceHour = Math.round(this.minute / 5);
		return this.lastTick - (SECONDS_PER_TICK * ticksSinceHour);
	}

	@computed({ serializeAs: 'next_hour' })
	public get nextHour(): number {
		let ticksUntilHour = Math.round((60 - this.minute) / 5);
		return this.lastTick + (SECONDS_PER_TICK * ticksUntilHour);
	}

	@afterSave()
	public static async afterSave(state: GameState) {
		await FeedService.broadcastGameState(state);
	}
}
