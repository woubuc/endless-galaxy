import Logger from '@ioc:Adonis/Core/Logger';
import Database from '@ioc:Adonis/Lucid/Database';
import Deferred from '@woubuc/deferred';
import GameState, { SECONDS_PER_TICK } from 'App/Models/GameState';
import Profit from 'App/Models/Profit';
import Ship from 'App/Models/Ship';
import Shipyard, { SHIPYARD_WORK_SPEED } from 'App/Models/Shipyard';
import ShipyardOrder from 'App/Models/ShipyardOrder';
import User from 'App/Models/User';
import FeedService from 'App/Services/FeedService';
import ShipTypeService from 'App/Services/ShipTypeDataService';
import { EntityOrId, getId } from 'App/Util/EntityOrId';
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

	public get week(): number {
		return this.gameState.week;
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
			await wait(500);
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
			let week = this.week;

			let usersLookup: Record<number, number> = {};
			let users = await User.query()
				.useTransaction(tx)
				.forUpdate()
				.whereNull('email_verify_token')
				.exec();
			for (let i = 0; i < users.length; i++) {
				let user = users[i];
				usersLookup[user.id] = i;
			}

			let userProfitsLookup: Record<number, number> = {};
			let userProfits: Profit[] = await Profit.query()
				.useTransaction(tx)
				.forUpdate()
				.where('week', week)
				.exec();
			for (let i = 0; i < userProfits.length; i++) {
				let profit = userProfits[i];
				userProfitsLookup[profit.userId] = i;
			}

			function addProfitEntry(user: EntityOrId<User>, category: string, key: string, amount: number, meta?: string) {
				let userId = getId(user);
				let index = userProfitsLookup[userId];

				if (index == undefined) {
					index = userProfits.length;
					userProfitsLookup[userId] = index;
					userProfits[index] = new Profit();
					userProfits[index].week = week;
					userProfits[index].userId = userId;
					userProfits[index].profitData = {};
				}

				userProfits[index].addProfitEntry(category, key, amount, meta);
				users[usersLookup[userId]].money += amount;
			}

			let shipyards = await Shipyard.query()
				.useTransaction(tx)
				.forUpdate()
				.preload('orders', q => q
					.where('work_remaining', '>', 0)
					.orderBy('placed'),
				)
				.exec();

			for (let shipyard of shipyards) {
				if (shipyard.orders.length === 0) {
					continue;
				}

				let work = SHIPYARD_WORK_SPEED;
				for (let order of shipyard.orders) {
					if (order.workRemaining > work) {
						order.workRemaining -= work;
						work = 0;
					} else {
						work -= order.workRemaining;
						order.workRemaining = 0;

						let ship = new Ship();
						ship.shipType = order.shipType;
						ship.userId = order.userId;
						ship.planetId = shipyard.planetId;
						ship.movementDistance = 1;
						ship.movementDistanceRemaining = 1;
						await ship.useTransaction(tx).save();
						await FeedService.emitShip(ship.userId, ship);
					}

					if (order.$isDirty) {
						await FeedService.emitShipyardOrder(order.userId, order);
					}
					await order.useTransaction(tx).save();

					if (work <= 0) {
						break;
					}
				}

				if (shipyard.$isDirty) {
					await FeedService.broadcastShipyard(shipyard);
				}
			}

			await ShipyardOrder.query()
				.useTransaction(tx)
				.where('work_remaining', 0)
				.delete();

			let ships = await Ship.query()
				.useTransaction(tx)
				.forUpdate()
				.exec();

			let shipPromises: Promise<any>[] = [];
			for (let ship of ships) {
				let shipType = ShipTypeService.get(ship.shipType);

				if (ship.movementDistanceRemaining != null) {
					ship.movementDistanceRemaining -= shipType.speed;
					if (ship.movementDistanceRemaining <= 0) {
						ship.movementDistance = null;
						ship.movementDistanceRemaining = null;
					}
				}

				addProfitEntry(ship.userId, 'maintenance', `ship_run_cost`, -shipType.runCost, shipType.id);

				if (ship.$isDirty) {
					shipPromises.push(ship.useTransaction(tx).save());
					shipPromises.push(FeedService.emitShip(ship.userId, ship));
				}
			}
			await Promise.all(shipPromises);

			for (let profit of userProfits) {
				if (profit.$isDirty) {
					await FeedService.emitProfit(profit.userId, profit);
				}
			}
			await Promise.all(userProfits.map(p => p.useTransaction(tx).save()));

			for (let user of users) {
				if (user.$isDirty) {
					await FeedService.emitUser(user);
				}
			}
			await Promise.all(users.map(u => u.useTransaction(tx).save()));

			this.gameState.day += 1;
			this.gameState.lastTick += SECONDS_PER_TICK;

			await this.gameState.useTransaction(tx).save();
			await FeedService.broadcastGameState(this.gameState);
		});

		this.pendingTickPromise.resolve();
		this.pendingTickPromise = undefined;
		Logger.info('Game tick finished in %dms', Date.now() - t);
	}
}

export default new GameService();
