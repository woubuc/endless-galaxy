import Logger from '@ioc:Adonis/Core/Logger';
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
import { LucidRow } from '@ioc:Adonis/Lucid/Orm';
import { GAME_MINUTES_PER_TICK, SHIPYARD_WORK_HOURLY, STAFF_COST_HOURLY } from 'App/Constants';
import { AutoTraderSellMode } from 'App/Models/AutoTraderConfig';
import Factory, { FactoryId } from 'App/Models/Factory';
import GameState from 'App/Models/GameState';
import { Inventory } from 'App/Models/Inventory';
import Market from 'App/Models/Market';
import MarketBuyOrder from 'App/Models/MarketBuyOrder';
import MarketSellOrder from 'App/Models/MarketSellOrder';
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
import { add, take } from 'App/Util/InventoryUtils';
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
		await Tick.time('tick:create_auto_trade_orders', this.tickCreateAutoTradeOrders());
		await Tick.time('tick:match_market_orders', this.tickMatchMarketOrders());
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

	private async tickCreateAutoTradeOrders(): Promise<void> {
		let warehouses = await this.warehouses.get();
		let markets = await this.markets.get();

		let marketLowestValues: Record<number, Record<ItemTypeId, number>> = {};

		for (let warehouse of warehouses.values()) {
			let market = markets.get(warehouse.planetId);
			if (market == undefined) {
				continue;
			}

			if (marketLowestValues[market.id] == undefined) {
				marketLowestValues[market.id] = {};

				for (let order of market.sellOrders) {
					if (order.createdByAutoTrader) {
						continue;
					}

					if (order.price < marketLowestValues[market.id][order.itemType] ?? Infinity) {
						marketLowestValues[market.id][order.itemType] = order.price;
					}
				}
			}

			for (let [itemTypeId, config] of Object.entries(warehouse.autoTrader)) {
				let storedAmount = warehouse.inventory[itemTypeId]?.amount ?? 0;

				if (storedAmount > config.amount && config.sell) {
					let sellAmount = storedAmount - config.amount;

					let price: number;
					if (config.sellMode === AutoTraderSellMode.Fixed) {
						price = config.sellPrice;
					} else if (config.sellMode === AutoTraderSellMode.ProfitMargin) {
						price = warehouse.inventory[itemTypeId].value + config.sellPrice;
					} else {
						price = (marketLowestValues[market.id][itemTypeId] ?? market.getMarketRate(itemTypeId)) - 1;
					}
					price = clamp(price, 1, Infinity);

					if (config.sellMode === AutoTraderSellMode.Fixed && config.sellAvoidLoss && price < warehouse.inventory[itemTypeId].value) {
						continue;
					}

					let addInventory = take(warehouse.inventory, { [itemTypeId]: sellAmount });
					if (addInventory !== false) {
						let existingOrder = market.sellOrders.find(o =>
							o.userId === warehouse.userId
							&& o.marketId === market!.id
							&& o.itemType === itemTypeId
							&& o.price === price
							&& o.createdByAutoTrader);
						if (existingOrder != undefined) {
							existingOrder.stack.amount += addInventory[itemTypeId].amount;
							existingOrder.stack.value = Math.round((existingOrder.stack.value + addInventory[itemTypeId].value) / 2);
						} else {
							let order = new MarketSellOrder();
							order.userId = warehouse.userId;
							order.marketId = market.id;
							order.itemType = itemTypeId;
							order.stack = addInventory[itemTypeId];
							order.price = price;
							order.createdByAutoTrader = true;
							market.sellOrders.push(order);
						}
					}
				} else if (storedAmount < config.amount && config.buy) {
					let buyAmount = config.amount - storedAmount;

					let alreadyBuying = 0;
					for (let order of market.buyOrders) {
						if (order.userId === warehouse.userId && order.itemType === itemTypeId) {
							alreadyBuying += order.amount;
						}
					}

					buyAmount -= alreadyBuying;
					if (buyAmount > 0) {
						let users = await this.users.get();
						let user = await users.get(warehouse.userId)!;

						let cost = config.buyPrice * buyAmount;
						if (user.money >= cost) {
							await this.addUserMoney(warehouse.userId, 'market', 'buy_order', -cost, `itemType.${ itemTypeId }`);

							let order = new MarketBuyOrder();
							order.userId = warehouse.userId;
							order.marketId = market.id;
							order.amount = buyAmount;
							order.price = config.buyPrice;
							order.itemType = itemTypeId;
							market.buyOrders.push(order);
						}
					}
				}
			}
		}
	}

	/**
	 * Matches buy orders and sell orders
	 */
	private async tickMatchMarketOrders(): Promise<void> {
		let markets = await this.markets.get();
		let warehouses = await this.warehouses.get();
		let shipyards = await this.shipyards.get();

		for (let market of markets.values()) {
			for (let buyOrder of market.buyOrders) {
				let sellOrders = market.sellOrders
					.filter(o => o.itemType === buyOrder.itemType)
					.filter(o => o.price <= buyOrder.price)
					.sort((a, b) => a.price - b.price);
				for (let sellOrder of sellOrders) {
					let amountToTake = Math.min(buyOrder.amount, sellOrder.amount);
					buyOrder.amount -= amountToTake;
					let stack = sellOrder.take(amountToTake);

					let buyerWarehouse: { inventory: Inventory };
					if (buyOrder.userId == null) {
						buyerWarehouse = shipyards.get(buyOrder.shipyardId!)!;
					} else {
						buyerWarehouse = warehouses.get([market.planetId, buyOrder.userId])!;
					}
					add(buyerWarehouse.inventory, { [buyOrder.itemType]: stack });

					let buyOrderPrice = amountToTake * buyOrder.price;
					let sellOrderPrice = amountToTake * sellOrder.price;
					let refund = buyOrderPrice - sellOrderPrice;

					await this.addUserMoney(sellOrder.userId, 'market', 'sale', sellOrderPrice, `itemType.${ buyOrder.itemType }`);
					if (buyOrder.userId != null) {
						await this.addUserMoney(buyOrder.userId, 'market', 'refund', refund, `itemType.${ buyOrder.itemType }`);
					}

					market.updateMarketRate(buyOrder.itemType, sellOrder.price);

					if (sellOrder.amount === 0) {
						if (sellOrder.$isPersisted) {
							this.await(sellOrder.useTransaction(this.tx).delete());
						}
						market.sellOrders.splice(market.sellOrders.indexOf(sellOrder), 1);
					}

					if (buyOrder.amount === 0) {
						if (buyOrder.$isPersisted) {
							this.await(buyOrder.useTransaction(this.tx).delete());
						}
						market.buyOrders.splice(market.buyOrders.indexOf(buyOrder), 1);
						break;
					}
				}
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
			let market = markets.get(planet.id);
			if (market == undefined) {
				continue;
			}

			let totalNeeded = 0;
			let missing = 0;

			for (let [itemTypeId, amount] of Object.entries(planet.populationDemandsPerHour)) {
				let remainingAmount = Math.ceil(amount / 60 * GAME_MINUTES_PER_TICK);
				totalNeeded += remainingAmount;

				let orders = market.sellOrders
					.filter(o => o.itemType === itemTypeId)
					.sort((a, b) => a.price - b.price);
				for (let order of orders) {
					if (order.stack.amount > remainingAmount) {
						order.stack.amount -= remainingAmount;
						await this.addUserMoney(order.userId, 'market', 'sale', order.price * remainingAmount, `itemType.${ itemTypeId }`);
						remainingAmount = 0;
					} else {
						remainingAmount -= order.stack.amount;
						await this.addUserMoney(order.userId, 'market', 'sale', order.price * order.stack.amount, `itemType.${ itemTypeId }`);

						if (order.$isPersisted) {
							this.await(order.useTransaction(this.tx).delete());
						}
						market.sellOrders.splice(market.sellOrders.indexOf(order), 1);
					}

					market.updateMarketRate(order.itemType, order.price);

					if (remainingAmount <= 0) {
						break;
					}
				}
				missing += remainingAmount;
			}

			let pctDemandMet = 1 - (missing / totalNeeded);
			planet.demandRate = Math.round(((pctDemandMet * 1000) + planet.demandRate) / 2);

			if (planet.id === 2) {
				planet.demandRate = 1000;
			}

			let thresholds: [number, number, number, number];
			if (planet.population <= 1000) {
				thresholds = [20, 50, 150, 250];
			} else if (planet.population <= 1500) {
				thresholds = [80, 200, 350, 500];
			} else if (planet.population <= 2000) {
				thresholds = [150, 300, 450, 600];
			} else if (planet.population <= 3000) {
				thresholds = [200, 350, 550, 750];
			} else {
				thresholds = [300, 500, 750, 950];
			}

			if (planet.demandRate < thresholds[0]) {
				planet.population *= 0.95 + (Math.random() * 0.02);
			} else if (planet.demandRate < thresholds[1]) {
				planet.population *= 0.985 + (Math.random() * 0.01);
			} else if (planet.demandRate < thresholds[2]) {
				planet.population *= 0.995 + (Math.random() * 0.05);
			} else if (planet.demandRate < thresholds[3]) {
				planet.population *= 1.025 + (Math.random() * 0.05);
			} else {
				planet.population *= 1.06 + (Math.random() * 0.06);
			}

			planet.population = clamp(planet.population, 1000, Infinity);
			planet.population = Math.round(planet.population * (0.98 + (Math.random() * 0.04)));
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
						.filter(order => order.itemType === itemId)
						.sort((a, b) => a.price - b.price);
					for (let sellOrder of sellOrders) {
						if (sellOrder.amount > neededAmount) {
							let stack = sellOrder.take(neededAmount);
							add(shipyard.inventory, { [itemId]: stack });
							neededAmount = 0;
						} else {
							add(shipyard.inventory, { [itemId]: sellOrder.stack });
							if (sellOrder.$isPersisted) {
								this.await(sellOrder.useTransaction(this.tx).delete());
							}
							market.sellOrders.splice(market.sellOrders.indexOf(sellOrder), 1);
							neededAmount = 0;
							break;
						}

						market.updateMarketRate(sellOrder.itemType, sellOrder.price);
					}
				}

				let existingBuyOrder = market.buyOrders.find(order => order.itemType === itemId && order.shipyardId === shipyard.id);

				if (existingBuyOrder != undefined) {
					if (!shouldBuy || neededAmount === 0) {
						if (existingBuyOrder.$isPersisted) {
							this.await(existingBuyOrder.useTransaction(this.tx).delete());
						}
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

					if (order.$isPersisted) {
						this.await(order.useTransaction(this.tx).delete());
					}
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
			let factoryTypeData = FactoryTypeDataService.get(factory.factoryType);

			let planet = planets.get(factory.planetId)!;
			let planetTypeData = PlanetTypeDataService.get(planet.planetType);

			let warehouse = warehouses.get([factory.planetId, factory.userId])!;

			let staffCost = STAFF_COST_HOURLY * factoryTypeData.staff;
			await this.addUserMoney(factory.userId, 'production', 'staff', -staffCost, `factoryType.${ factory.factoryType }`);

			if (factory.recipe == null) {
				continue;
			}

			let recipeData = RecipeDataService.get(factory.recipe!);

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
					inventory[itemTypeId] = { amount: Math.round(amount * modifier), value };
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
		Logger.debug('Tick: %s (%dms)', label, Date.now() - t);
		return result;
	}
}
