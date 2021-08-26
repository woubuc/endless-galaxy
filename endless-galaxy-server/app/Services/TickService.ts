import Logger from '@ioc:Adonis/Core/Logger';
import Database from '@ioc:Adonis/Lucid/Database';
import Deferred from '@woubuc/deferred';
import { GAME_MINUTES_PER_TICK, SECONDS_PER_TICK } from 'App/Constants';
import GameService from 'App/Services/GameService';
import Tick from 'App/Tick';
import { now, wait } from 'App/Util/TimeUtils';

class TickService {

	private shouldTickRun = false;
	private pendingTickPromise?: Deferred<void> = undefined;

	public get isTickRunning(): boolean {
		return this.pendingTickPromise !== undefined;
	}

	public get pendingTick(): Promise<void> {
		return this.pendingTickPromise ?? Promise.resolve();
	}

	public async start(): Promise<void> {
		this.shouldTickRun = true;

		// noinspection ES6MissingAwait
		this.run();
	}

	public async run(): Promise<void> {
		while (this.shouldTickRun) {
			if (GameService.state.nextTick <= now()) {
				await this.pendingTick;
				try {
					await this.tick();
				} catch (err) {
					Logger.error({ err }, 'Tick error');
				}
			}
			await wait(250);
		}
	}

	public async stop() {
		this.shouldTickRun = false;
		await this.pendingTick;
	}

	private async tick() {
		let t = Date.now();
		Logger.info('Starting game tick');
		this.pendingTickPromise = new Deferred();

		await Database.transaction(async (tx) => {
			Logger.debug('Setting up tick');
			let t = Date.now();
			let tick = new Tick(tx, GameService.state);
			await this.runTick(tick);
			await tick.finalise();
			Logger.debug('Tick finished in %dms', Date.now() - t);

			GameService.state.lastTick += SECONDS_PER_TICK;
			await GameService.state.useTransaction(tx).save();
		});

		this.pendingTickPromise.resolve();
		this.pendingTickPromise = undefined;
		Logger.info('Game tick finished in %dms', Date.now() - t);

		if (GameService.state.nextTick < now()) {
			let missedTicks = Math.floor((now() - GameService.state.lastTick) / SECONDS_PER_TICK);
			Logger.warn('Running %d ticks behind', missedTicks);
		}
	}

	private async runTick(tick: Tick) {
		GameService.state.minute += GAME_MINUTES_PER_TICK;

		await tick.tick();
		if (GameService.state.minute < 60) {
			return;
		}

		GameService.state.minute -= 60;
		GameService.state.hour++;

		await tick.hourly();
		if (GameService.state.hour < 24) {
			return;
		}

		GameService.state.hour -= 24;
		GameService.state.day++;

		await tick.daily();
		if (GameService.state.day < 7) {
			return;
		}

		GameService.state.day -= 7;
		GameService.state.week++;

		await tick.weekly();
		if (GameService.state.week < 4) {
			return;
		}

		GameService.state.week -= 4;
		GameService.state.month++;

		await tick.monthly();
		if (GameService.state.month < 12) {
			return;
		}

		GameService.state.month -= 12;
		GameService.state.year++;
		await tick.yearly();
	}
}

export default new TickService();
