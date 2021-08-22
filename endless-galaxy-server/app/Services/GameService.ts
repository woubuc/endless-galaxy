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

	/*
		async _tick() {
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

				type Tuple = string;

				function tuple(...args: any[]): Tuple {
					return args.join('_');
				}

				let warehouses = new Map<Tuple, Warehouse>();
				await Warehouse.query()
					.useTransaction(tx)
					.forUpdate()
					.exec()
					.then(rows => {
						for (let warehouse of rows) {
							warehouses.set(tuple(warehouse.planetId, warehouse.userId), warehouse);
						}
					});

				let shipyards = await Shipyard.query()
					.useTransaction(tx)
					.forUpdate()
					.preload('orders', q => q
						.where('work_remaining', '>', 0)
						.orderBy('placed'),
					)
					.exec();

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
					}
				}
				await Promise.all(shipPromises);

				await Promise.all(userProfits.map(p => p.useTransaction(tx).save()));
				await Promise.all(Array.from(warehouses.values()).map(w => w.useTransaction(tx).save()));
				await Promise.all(users.map(u => u.useTransaction(tx).save()));

				this.gameState.day += 1;
				this.gameState.lastTick += SECONDS_PER_TICK;

				await this.gameState.useTransaction(tx).save();
				await FeedService.broadcastGameState(this.gameState);
			});

			this.pendingTickPromise.resolve();
			this.pendingTickPromise = undefined;
			Logger.info('Game tick finished in %dms', Date.now() - t);
		}*/
}

export default new GameService();
