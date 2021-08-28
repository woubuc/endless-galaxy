import GameState from 'App/Models/GameState';
import FeedService from 'App/Services/FeedService';
import { now } from 'App/Util/TimeUtils';

class GameService {

	public state: GameState;

	public async load(): Promise<void> {
		this.state = await GameState.firstOrCreate({ id: 1 }, {
			id: 1,
			minute: 0,
			hour: 1,
			day: 1,
			week: 1,
			month: 1,
			year: 1,
			lastTick: now(),
		});

		await FeedService.broadcastGameState(this.state);
	}
}

export default new GameService();
