import Emittery from 'emittery';
import Deferred from '@woubuc/deferred';
import { Vue } from 'nuxt-property-decorator';
import Market from '../models/Market';
import MarketBuyOrder from '../models/MarketBuyOrder';
import MarketSellOrder from '../models/MarketSellOrder';
import Planet from '../models/Planet';
import Profit from '../models/Profit';
import Ship from '../models/Ship';
import Shipyard from '../models/Shipyard';
import ShipyardOrder from '../models/ShipyardOrder';
import User from '../models/User';
import { createDecorator } from 'vue-class-component';
import Warehouse from '../models/Warehouse';

export interface FeedEvents {
	user: User;
	planet: Planet;
	ship: Ship;
	profit: Profit;
	shipyard: Shipyard;
	shipyardOrder: ShipyardOrder;
	warehouse: Warehouse;
	market: Market;
	marketBuyOrder: MarketBuyOrder;
	marketSellOrder: MarketSellOrder;
}

const events = new Emittery<FeedEvents>();
export default events;

let feed: EventSource | null = null;

export function connectFeed(): Promise<void> {
	let deferred = new Deferred<void>();

	disconnectFeed();

	feed = new EventSource(`${ process.env.SERVER_BASE_URL }/feed`, {
		withCredentials: true,
	});

	feed.onopen = () => deferred.resolve();
	feed.onerror = onError;
	feed.onmessage = onMessage;

	return deferred;
}

export function disconnectFeed() {
	if (feed == null) {
		return;
	}

	feed.close();
	feed = null;
}

function onError(evt: Event) {
	console.warn('[Feed] An error occurred', evt);
	void connectFeed();
}

function onMessage(evt: MessageEvent) {
	let payload = JSON.parse(evt.data);
	console.log('[Feed] %s:', payload.evt, payload.data);
	void events.emit(payload.evt, payload.data);
}

export const Feed = (evt?: keyof FeedEvents) => createDecorator((options, key) => {
	if (evt == undefined) {
		evt = key as keyof FeedEvents;
	}

	if (options.mixins == undefined) {
		options.mixins = [];
	}

	let methodName = `$$feedUpdater$${ key }`;

	options.mixins.push({
		created() {
			// @ts-ignore
			events.on(evt, this[methodName]);
		},
		beforeDestroy() {
			// @ts-ignore
			events.off(evt, this[methodName]);
		},
		methods: {
			[methodName](data: any) {
				// @ts-ignore
				let existingData = this[key] as any;

				if (Array.isArray(existingData)) {
					if (data.$delete == undefined) {
						let index = existingData.findIndex((entry) => entry.id === data.id);
						console.log('Index to replace:', index);
						if (index === -1) {
							existingData.push(data);
						} else {
							existingData.splice(index, 1, data);
						}
					} else {
						let index = existingData.findIndex((entry) => entry.id === data.$delete);
						existingData.splice(index, 1);
					}
				} else {
					Vue.set(this, key, data);
				}
			}
		},
	});

	console.log('Feed:', options, 'k:', key, 'evt:', evt);
});
