import Logger from '@ioc:Adonis/Core/Logger';
import MultiMap from '@woubuc/multimap';
import GameState from 'App/Models/GameState';
import MarketSellOrder from 'App/Models/MarketSellOrder';
import Planet from 'App/Models/Planet';
import Profit from 'App/Models/Profit';
import Ship from 'App/Models/Ship';
import Shipyard from 'App/Models/Shipyard';
import ShipyardOrder from 'App/Models/ShipyardOrder';
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

	public async emitProfit(user: EntityOrId<User>, profit: Profit) {
		this.emitEvent(getId(user), 'profit', profit.serialize());
	}

	public async emitWarehouse(user: EntityOrId<User>, warehouse: Warehouse) {
		this.emitEvent(getId(user), 'warehouse', warehouse.serialize());
	}

	public async emitShipyardOrder(user: EntityOrId<User>, order: ShipyardOrder) {
		this.emitEvent(getId(user), 'shipyardOrder', order.serialize());
	}

	public async emitDeleteShipyardOrder(user: EntityOrId<User>, order: EntityOrId<ShipyardOrder>) {
		this.emitEvent(getId(user), 'shipyardOrder', { $delete: getId(order) });
	}

	public async emitShip(user: EntityOrId<User>, ship: Ship) {
		this.emitEvent(getId(user), 'ship', ship.serialize());
	}

	public async broadcastShipyard(shipyard: Shipyard) {
		this.broadcastEvent('shipyard', shipyard.serialize());
	}

	public async broadcastMarketBuyOrder(order: MarketSellOrder) {
		this.broadcastEvent('marketSellOrder', order.serialize());
	}

	public async broadcastDeleteMarketBuyOrder(order: EntityOrId<MarketSellOrder>) {
		this.broadcastEvent('marketSellOrder', { $delete: getId(order) });
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
