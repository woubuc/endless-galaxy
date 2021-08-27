import Logger from '@ioc:Adonis/Core/Logger';
import MultiMap from '@woubuc/multimap';
import Factory from 'App/Models/Factory';
import GameState from 'App/Models/GameState';
import MarketBuyOrder from 'App/Models/MarketBuyOrder';
import MarketSellOrder from 'App/Models/MarketSellOrder';
import Planet from 'App/Models/Planet';
import Profit from 'App/Models/Profit';
import Ship from 'App/Models/Ship';
import Shipyard from 'App/Models/Shipyard';
import ShipyardOrder from 'App/Models/ShipyardOrder';
import Shop from 'App/Models/Shop';
import User from 'App/Models/User';
import Warehouse from 'App/Models/Warehouse';
import { EntityOrId, getId } from 'App/Util/EntityOrId';
import { ServerResponse } from 'http';

class FeedService {

	private feeds = new MultiMap<number, ServerResponse>();
	private state = new Map<string, any>();

	public constructor() {
		setInterval(() => this.ping(), 10_000);
	}

	public get connectedUsers(): IterableIterator<number> {
		return this.feeds.keys();
	}

	public registerFeed(account: EntityOrId<User>, feed: ServerResponse) {
		let accountId = getId(account);
		this.feeds.push(accountId, feed);

		for (let [evt, data] of this.state.entries()) {
			feed.write(makePayload(evt, data));
		}

		Logger.debug({ accountId }, '[SSE] Feed connected');
	}

	public unregisterFeed(account: EntityOrId<User>, feed: ServerResponse) {
		let accountId = getId(account);

		// Take out the feeds array, remove the disconnected feed, then put the updated array back
		let feeds = this.feeds.get(accountId);
		let index = feeds.indexOf(feed);
		feeds.splice(index, 1);
		this.feeds.set(accountId, feeds);

		Logger.debug({ accountId }, '[SSE] Feed disconnected');
	}

	private broadcastEvent(evt: string, data?: any) {
		let payload = makePayload(evt, data);

		for (let feed of this.feeds.flatValues()) {
			feed.write(payload);
		}
	}

	private broadcastState(evt: string, data?: any) {
		this.state.set(evt, data);
		this.broadcastEvent(evt, data);
	}

	private emitEvent(userId: number, evt: string, data?: any) {
		let payload = makePayload(evt, data);

		for (let feed of this.feeds.get(userId)) {
			feed.write(payload);
		}
	}

	private ping() {
		let count = this.feeds.flatSize;
		if (count === 0) {
			return;
		}

		Logger.debug('[SSE] Pinging %d connected feed(s)', count);
		this.broadcastEvent('ping');
	}

	public async broadcastGameState(gameState: GameState) {
		this.broadcastState('gameState', gameState.serialize());
	}

	public async emitUser(user: User) {
		this.emitEvent(user.id, 'user', user.serialize());
	}

	public async emitPlanet(user: EntityOrId<User>, planet: Planet) {
		this.emitEvent(getId(user), 'planet', planet.serialize());
	}

	public async emitProfit(profit: Profit) {
		this.emitEvent(profit.userId, 'profit', profit.serialize());
	}

	public async emitWarehouse(warehouse: Warehouse) {
		this.emitEvent(warehouse.userId, 'warehouse', warehouse.serialize());
	}

	public async emitShipyardOrder(order: ShipyardOrder) {
		this.emitEvent(order.userId, 'shipyardOrder', order.serialize());
	}

	public async emitDeleteShipyardOrder(order: ShipyardOrder) {
		this.emitEvent(order.userId, 'shipyardOrder', { $delete: order.id });
	}

	public async emitShip(ship: Ship) {
		this.emitEvent(ship.userId, 'ship', ship.serialize());
	}

	public async emitFactory(factory: Factory) {
		this.emitEvent(factory.userId, 'factory', factory.serialize());
	}

	public async emitFactoryDelete(factory: Factory) {
		this.emitEvent(factory.userId, 'factory', { $delete: factory.id });
	}

	public async emitShop(shop: Shop) {
		this.emitEvent(shop.userId, 'shop', shop.serialize());
	}

	public async broadcastShipyard(shipyard: Shipyard) {
		this.broadcastEvent('shipyard', shipyard.serialize());
	}

	public async broadcastMarketBuyOrder(order: MarketBuyOrder) {
		this.broadcastEvent('marketBuyOrder', order.serialize());
	}

	public async broadcastDeleteMarketBuyOrder(order: EntityOrId<MarketBuyOrder>) {
		this.broadcastEvent('marketBuyOrder', { $delete: getId(order) });
	}

	public async broadcastMarketSellOrder(order: MarketSellOrder) {
		this.broadcastEvent('marketSellOrder', order.serialize());
	}

	public async broadcastDeleteMarketSellOrder(order: EntityOrId<MarketSellOrder>) {
		this.broadcastEvent('marketSellOrder', { $delete: getId(order) });
	}
}

function makePayload(evt: string, data?: any): string {
	return `data: ${ JSON.stringify({ evt, data }) }\n\n`;
}

export default new FeedService();
