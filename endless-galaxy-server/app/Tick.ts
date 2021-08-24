import Logger from '@ioc:Adonis/Core/Logger';
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
import { LucidRow } from '@ioc:Adonis/Lucid/Orm';
import { GAME_MINUTES_PER_TICK, SHIPYARD_WORK_HOURLY, STAFF_COST_HOURLY } from 'App/Constants';
import Factory, { FactoryId } from 'App/Models/Factory';
import GameState from 'App/Models/GameState';
import { Inventory } from 'App/Models/Inventory';
import Market from 'App/Models/Market';
import MarketBuyOrder from 'App/Models/MarketBuyOrder';
import Planet, { PlanetId } from 'App/Models/Planet';
import Profit from 'App/Models/Profit';
import Ship, { ShipId } from 'App/Models/Ship';
import Shipyard from 'App/Models/Shipyard';
import User, { UserId } from 'App/Models/User';
import Warehouse from 'App/Models/Warehouse';
import FactoryTypeDataService from 'App/Services/FactoryTypeDataService';
import { ItemTypeId } from 'App/Services/ItemTypeDataService';
import PlanetTypeDataService from 'App/Services/PlanetTypeDataService';
import RecipeDataService from 'App/Services/RecipeDataService';
import ShipTypeDataService from 'App/Services/ShipTypeDataService';
import CombiMap from 'App/Util/CombiMap';
import { EntityOrId, getId } from 'App/Util/EntityOrId';
import { add, contains, take, volumeOf } from 'App/Util/InventoryUtils';
import { clamp } from 'App/Util/NumberUtils';
import { Once } from 'App/Util/Once';
import { ReadonlyDeep } from 'type-fest';

export default class Tick {

	public constructor(
		private readonly tx: TransactionClientContract,
		private readonly state: ReadonlyDeep<GameState>,
	) {}

	/**
	 * Runs actions that need to happen every tick
	 */
	public async tick(): Promise<void> {
		Logger.debug('Running common tick');

		await Tick.time('tick:ships_move', this.tickShipsMove());
		await Tick.time('tick:purchase_settlement_resources', this.tickPurchaseSettlementResources());
		await Tick.time('tick:purchase_shipyard_orders', this.tickPurchaseShipyardResources());
	}

	/**
	 * Move ships
	 */
	private async tickShipsMove(): Promise<void> {
		let ships = await this.ships.get();

		for (let ship of ships.values()) {
			if (ship.movementMinutesRemaining == null) {
				continue;
			}

			ship.movementMinutesRemaining -= GAME_MINUTES_PER_TICK;
			if (ship.movementMinutesRemaining <= 0) {
				ship.movementMinutes = null;
				ship.movementMinutesRemaining = null;
			}
		}
	}

	/**
	 * Buy resources for settlements
	 */
	private async tickPurchaseSettlementResources(): Promise<void> {
		let planets = await this.planets.get();
		let markets = await this.markets.get();

		for (let planet of planets.values()) {
			if (planet.id !== 2) {
				continue;
			}

			let market = markets.get(planet.id);
			if (market == undefined) {
				continue;
			}

			let totalNeeded = 0;
			let missing = 0;

			for (let [itemTypeId, amount] of Object.entries(planet.populationDemandsPerHour)) {
				let remainingAmount = Math.ceil(amount / 60 * GAME_MINUTES_PER_TICK);
				totalNeeded += remainingAmount;
				let orders = market.sellOrders.filter(o => o.itemType === itemTypeId);
				for (let order of orders) {
					if (order.stack.amount > remainingAmount) {
						order.stack.amount -= remainingAmount;
						await this.addUserMoney(order.userId, 'market', 'sale', order.stack.value * remainingAmount, itemTypeId);
					} else {
						remainingAmount -= order.stack.amount;
						await this.addUserMoney(order.userId, 'market', 'sale', order.stack.value * order.stack.amount, itemTypeId);
						this.await(order.useTransaction(this.tx).delete());
						market.sellOrders.splice(market.sellOrders.indexOf(order), 1);
					}

					if (remainingAmount <= 0) {
						break;
					}
				}
				missing += remainingAmount;
			}

			let pctDemandMet = 1 - (missing / totalNeeded);
			if (pctDemandMet < 0.25) {
				planet.population *= 0.96;
			} else if (pctDemandMet < 0.50) {
				planet.population *= 0.99;
			} else if (pctDemandMet < 0.75) {
				planet.population *= 0.998;
			} else if (pctDemandMet < 0.95) {
				planet.population *= 1.01;
			} else {
				planet.population *= 1.025;
			}
			planet.population = Math.round(clamp(planet.population, 1000, Infinity));
		}
	}

	/**
	 * Create buy orders for shipyards
	 */
	private async tickPurchaseShipyardResources(): Promise<void> {
		let shipyards = await this.shipyards.get();
		let markets = await this.markets.get();

		let desiredInventory: Record<ItemTypeId, number> = {};
		for (let ship of ShipTypeDataService.getAll().values()) {
			for (let [itemId, amount] of Object.entries(ship.resources)) {
				if (!desiredInventory[itemId]) {
					desiredInventory[itemId] = amount;
				} else {
					desiredInventory[itemId] += amount;
				}
			}
		}

		for (let shipyard of shipyards.values()) {
			let market = markets.get(shipyard.planetId);
			if (!market) {
				continue;
			}

			for (let [itemId, desiredAmount] of Object.entries(desiredInventory)) {
				let storedAmount = shipyard.inventory[itemId]?.amount ?? 0;
				let neededAmount = desiredAmount - storedAmount;
				let shouldBuy = storedAmount < desiredAmount;

				if (shouldBuy) {
					let sellOrders = market.sellOrders
						.filter(order => order.itemType)
						.sort((a, b) => a.price - b.price);
					for (let sellOrder of sellOrders) {
						if (sellOrder.amount > neededAmount) {
							let stack = sellOrder.take(neededAmount);
							add(shipyard.inventory, { [itemId]: stack });
							neededAmount = 0;
						} else {
							add(shipyard.inventory, { [itemId]: sellOrder.stack });
							this.await(sellOrder.useTransaction(this.tx).delete());
							market.sellOrders.splice(market.sellOrders.indexOf(sellOrder), 1);
							neededAmount = 0;
							break;
						}
					}
				}

				let existingBuyOrder = market.buyOrders.find(order => order.itemType === itemId && order.shipyardId === shipyard.id);

				if (existingBuyOrder != undefined) {
					if (!shouldBuy || neededAmount === 0) {
						this.await(existingBuyOrder.useTransaction(this.tx).delete());
						market.buyOrders.splice(market.buyOrders.indexOf(existingBuyOrder), 1);
					} else {
						existingBuyOrder.price = market.getMarketRate(itemId);
						existingBuyOrder.amount = neededAmount;
					}
				} else if (neededAmount > 0) {
					let buyOrder = new MarketBuyOrder();
					buyOrder.marketId = market.id;
					buyOrder.itemType = itemId;
					buyOrder.amount = desiredAmount - storedAmount;
					buyOrder.price = market.getMarketRate(itemId);
					buyOrder.shipyardId = shipyard.id;
					market.buyOrders.push(buyOrder);
				}
			}
		}
	}

	/**
	 * Runs all actions that need to happen once per game hour
	 */
	public async hourly(): Promise<void> {
		Logger.debug('Running hourly tick');

		await Tick.time('hourly:shipyard_orders', this.hourlyShipyardOrders());
		await Tick.time('hourly:factory_production', this.hourlyFactoryProduction());
	}

	/**
	 * Processes orders in shipyards
	 */
	private async hourlyShipyardOrders(): Promise<void> {
		let shipyards = await this.shipyards.get();

		for (let shipyard of shipyards.values()) {
			if (shipyard.orders.length === 0) {
				continue;
			}

			let shipyardWorkRemaining = SHIPYARD_WORK_HOURLY;

			for (let order of shipyard.orders) {
				if (order.workRemaining > shipyardWorkRemaining) {
					order.workRemaining -= shipyardWorkRemaining;
					shipyardWorkRemaining = 0;
				} else {
					shipyardWorkRemaining -= order.workRemaining;
					order.workRemaining = 0;

					let ships = await this.ships.get();

					let ship = new Ship();
					ship.shipType = order.shipType;
					ship.userId = order.userId;
					ship.planetId = shipyard.planetId;
					ship.movementMinutes = 15;
					ship.movementMinutesRemaining = 15;
					ships.add(ship);

					this.await(order.useTransaction(this.tx).delete());
					shipyard.orders.splice(shipyard.orders.indexOf(order), 1);
				}

				if (shipyardWorkRemaining <= 0) {
					break;
				}
			}
		}
	}

	/**
	 * Processes
	 */
	private async hourlyFactoryProduction(): Promise<void> {
		let warehouses = await this.warehouses.get();
		let factories = await this.factories.get();
		let planets = await this.planets.get();

		for (let factory of factories.values()) {
			let recipeData = RecipeDataService.get(factory.recipe!);
			let factoryTypeData = FactoryTypeDataService.get(factory.factoryType);

			let planet = planets.get(factory.planetId)!;
			let planetTypeData = PlanetTypeDataService.get(planet.planetType);

			let warehouse = warehouses.get([factory.planetId, factory.userId])!;

			let staffCost = STAFF_COST_HOURLY * factoryTypeData.staff;
			await this.addUserMoney(factory.userId, 'production', 'staff', -staffCost, `factoryType.${ factory.factoryType }`);

			if (factory.recipe == null) {
				continue;
			}

			function startRecipe() {
				let input = take(warehouse.inventory, recipeData.input);
				if (input === false) {
					return;
				}

				factory.productionCosts = 0;
				for (let stack of Object.values(input)) {
					factory.productionCosts += stack.amount * stack.value;
				}
				factory.productionCosts = Math.round(factory.productionCosts);

				factory.hoursRemaining = recipeData.hours;
			}

			if (factory.hoursRemaining === 0) {
				startRecipe();
				continue;
			}

			factory.productionCosts += staffCost;
			factory.hoursRemaining -= 1;

			if (factory.hoursRemaining === 0) {
				let totalOutputItems = 0;
				for (let [itemTypeId, count] of Object.entries(recipeData.output)) {
					let modifier = planetTypeData.recipeOutputModifiers[itemTypeId] ?? 1;
					totalOutputItems += count * modifier;
				}

				let value = factory.productionCosts / totalOutputItems;
				let inventory: Inventory = {};
				for (let [itemTypeId, amount] of Object.entries(recipeData.output)) {
					let modifier = planetTypeData.recipeOutputModifiers[itemTypeId] ?? 1;
					inventory[itemTypeId] = { amount: amount * modifier, value };
				}

				add(warehouse.inventory, inventory);

				if (factory.repeat) {
					startRecipe();
				} else {
					factory.recipe = null;
					factory.hoursRemaining = 0;
				}
			}
		}
	}

	public async daily(): Promise<void> {
		Logger.debug('Running daily tick');
	}

	public async weekly(): Promise<void> {
		Logger.debug('Running weekly tick');

	}

	public async monthly(): Promise<void> {
		Logger.debug('Running monthly tick');

	}

	public async yearly(): Promise<void> {
		Logger.debug('Running yearly tick');
	}

	private async addUserMoney(
		userId: EntityOrId<User>,
		category: string,
		key: string,
		amount: number,
		meta?: string,
	): Promise<void> {
		let users = await this.users.get();
		let profits = await this.profits.get();

		userId = getId(userId);

		let user = users.get(userId)!;
		let profit = profits.get(userId);

		if (profit === undefined) {
			profit = new Profit();
			profit.userId = userId;
			profit.week = this.state.week;
			profit.profitData = {};
			profit.total = 0;
			profits.set(userId, profit);
		}

		user.money += amount;
		profit.addProfitEntry(category, key, amount, meta);
	}


	public async finalise(): Promise<void> {
		await Promise.all(this.promises);

		await Promise.all([
			this.factories.with(factories => this.save(factories)),
			this.markets.with(markets => this.save(markets, m => m.buyOrders, m => m.sellOrders)),
			this.planets.with(planets => this.save(planets)),
			this.profits.with(profits => this.save(profits)),
			this.ships.with(ships => this.save(ships)),
			this.shipyards.with(shipyards => this.save(shipyards, s => s.orders)),
			this.users.with(users => this.save(users)),
			this.warehouses.with(warehouses => this.save(warehouses)),
		]);
	}

	private promises: Promise<any>[] = [];

	private await<T extends Promise<any>>(promise: T): void {
		this.promises.push(promise);
	}

	private factories: Once<CombiMap<FactoryId, Factory>> = new Once(() => {
		return Factory.query()
			.useTransaction(this.tx)
			.forUpdate()
			.exec()
			.then(rows => CombiMap.from(rows, f => f.id));
	});

	private markets: Once<CombiMap<PlanetId, Market>> = new Once(() => {
		return Market.query()
			.useTransaction(this.tx)
			.forUpdate()
			.preload('buyOrders', q => q.useTransaction(this.tx).forUpdate())
			.preload('sellOrders', q => q.useTransaction(this.tx).forUpdate())
			.exec()
			.then(rows => CombiMap.from(rows, m => m.planetId));
	});

	private planets: Once<CombiMap<PlanetId, Planet>> = new Once(() => {
		return Planet.query()
			.useTransaction(this.tx)
			.forUpdate()
			.exec()
			.then(rows => CombiMap.from(rows, p => p.id));
	});

	private profits: Once<CombiMap<UserId, Profit>> = new Once(() => {
		return Profit.query()
			.useTransaction(this.tx)
			.forUpdate()
			.where('week', this.state.week)
			.exec()
			.then(rows => CombiMap.from(rows, p => p.userId));
	});

	private ships: Once<CombiMap<ShipId, Ship>> = new Once(() => {
		return Ship.query()
			.useTransaction(this.tx)
			.forUpdate()
			.exec()
			.then(rows => CombiMap.from(rows, s => s.id));
	});

	private shipyards: Once<CombiMap<PlanetId, Shipyard>> = new Once(() => {
		return Shipyard.query()
			.useTransaction(this.tx)
			.forUpdate()
			.preload('orders', q => q
				.useTransaction(this.tx)
				.forUpdate()
				.orderBy('placed'),
			)
			.exec()
			.then(rows => CombiMap.from(rows, s => s.planetId));
	});

	private users: Once<CombiMap<UserId, User>> = new Once(() => {
		return User.query()
			.useTransaction(this.tx)
			.forUpdate()
			.exec()
			.then(rows => CombiMap.from(rows, u => u.id));
	});

	private warehouses: Once<CombiMap<[PlanetId, UserId], Warehouse>> = new Once(() => {
		return Warehouse.query()
			.useTransaction(this.tx)
			.forUpdate()
			.exec()
			.then(rows => CombiMap.from(rows, w => [w.planetId, w.userId]));
	});

	private async save<T extends LucidRow>(map: CombiMap<any, T>, ...relations: ((i: T) => LucidRow[])[]): Promise<void> {
		let promises: Promise<any>[] = [];

		for (let entity of map.values()) {
			promises.push(entity.useTransaction(this.tx).save());

			for (let fn of relations) {
				let relatedEntities = fn(entity);

				for (let e of relatedEntities) {
					promises.push(e.useTransaction(this.tx).save());
				}
			}
		}

		await Promise.all(promises);
	}

	private static async time<T>(label: string, promise: Promise<T>): Promise<T> {
		let t = Date.now();
		let result = await promise;
		Logger.trace('Tick: %s (%dms)', label, Date.now() - t);
		return result;
	}
}
