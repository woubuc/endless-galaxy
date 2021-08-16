import Logger from '@ioc:Adonis/Core/Logger';
import Database from '@ioc:Adonis/Lucid/Database';
import Deferred from '@woubuc/deferred';
import GameState from 'App/Models/GameState';
import User from 'App/Models/User';
import FeedService from 'App/Services/FeedService';
import { now, wait } from 'App/Util/TimeUtils';

class GameService {

	private gameState: GameState;
	private shouldTickRun = false;
	private pendingTickPromise?: Deferred<void> = undefined;

	public get state(): GameState {
		return this.gameState;
	}

	public get day(): number {
		return this.gameState.day;
	}

	public get nextTick(): number {
		return this.gameState.nextTick;
	}

	public get isTickRunning(): boolean {
		return this.pendingTickPromise !== undefined;
	}

	public get pendingTick(): Promise<void> {
		return this.pendingTickPromise ?? Promise.resolve();
	}

	async start() {
		this.gameState = await GameState.firstOrCreate({ id: 1 }, {
			id: 1,
			day: 1,
			lastTick: now(),
		});

		await FeedService.broadcastGameState(this.gameState);
		this.shouldTickRun = true;

		// noinspection ES6MissingAwait
		this.run(); // Don't await the game tick loop so it doesn't block the server startup
	}

	async run() {
		while (this.shouldTickRun) {
			if (this.nextTick <= now()) {
				await this.tick();
			}
			await wait(1_000);
		}
	}

	async stop() {
		this.shouldTickRun = false;
	}

	async tick() {
		let t = Date.now();
		Logger.info('Starting game tick');
		this.pendingTickPromise = new Deferred();

		await Database.transaction(async (tx) => {
			this.gameState.day += 1;
			this.gameState.lastTick = now();

			this.gameState.useTransaction(tx);
			await this.gameState.save();

			// TODO remove this test code
			User.all().then(async (users) => {
				for (let user of users) {
					if (!user.emailVerified) {
						continue;
					}

					user.money += 1_00;
					await user.save();
					await FeedService.emitUser(user);

					// let planet = await Planet.findOrFail(1);
					// planet.name += '1';
					// await planet.save();
					// await this.emitPlanet(user, planet);

					let profit = await user.related('profitHistory').create({
						day: this.gameState.day,
						total: 1_00,
						profitData: {
							various: [
								{ id: 'test', amount: 1_00 },
							],
						},
					});

					await FeedService.emitProfit(user, profit);
				}
			});
		});


		await FeedService.broadcastGameState(this.gameState);

		this.pendingTickPromise.resolve();
		this.pendingTickPromise = undefined;
		Logger.info('Game tick finished in %dms', Date.now() - t);
	}
}

export default new GameService();
