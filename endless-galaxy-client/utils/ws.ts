import Deferred from '@woubuc/deferred';
import Emittery from 'emittery';
import { Vue } from 'nuxt-property-decorator';
import { createDecorator } from 'vue-class-component';
import Planet from '../models/Planet';
import Profit from '../models/Profit';
import Ship from '../models/Ship';
import Shipyard from '../models/Shipyard';
import ShipyardOrder from '../models/ShipyardOrder';
import User from '../models/User';
import Warehouse from '../models/Warehouse';
import { request } from './request';

export interface WsEvents {
	user: User;
	planet: Planet;
	ship: Ship;
	profit: Profit;
	shipyard: Shipyard;
	shipyardOrder: ShipyardOrder;
	warehouse: Warehouse;
}

const events = new Emittery<WsEvents>();
export default events;

let ws: WebSocket | null = null;
let isAuthorised = false;

export async function connectWs(): Promise<void> {
	let deferred = new Deferred<void>();

	disconnectWs();

	isAuthorised = false;
	let { token } = await request('get', 'feed/token');
	ws = new WebSocket(process.env.WS_FEED_URL!);

	ws.onopen = () => {
		console.log('[WS] Connection opened, sending authentication token');
		ws!.send(JSON.stringify({ token }));
		deferred.resolve();
	};
	ws.onerror = onError;
	ws.onmessage = onMessage;
	ws.onclose = onClose;

	return deferred;
}

export function disconnectWs(reason?: string) {
	if (ws == null) {
		return;
	}

	ws.close(1000, reason);
	ws = null;
}

function onError(evt: Event) {
	console.warn('[WS] An error occurred', evt);
	void connectWs();
}

function onClose() {
	ws = null;
}

function onMessage(evt: MessageEvent) {
	let payload = JSON.parse(evt.data);
	console.log('[WS] %o', payload);
	//void events.emit(payload.evt, payload.data);
}

export function sendEvent(evt: string, payload: any) {
	send({ [evt]: payload });
}

export function send(payload: any) {
	if (ws == null) {
		console.warn('[WS] Not connected');
		return;
	}

	ws.send(JSON.stringify(payload));
}

export const Ws = (evt?: keyof WsEvents) => createDecorator((options, key) => {
	if (evt == undefined) {
		evt = key as keyof WsEvents;
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
					let index = existingData.findIndex((entry) => entry.id === data.id);
					console.log('Index to replace:', index);
					if (index === -1) {
						existingData.push(data);
					} else {
						existingData.splice(index, 1, data);
					}
				} else {
					Vue.set(this, key, data);
				}
			},
		},
	});

	console.log('Feed:', options, 'k:', key, 'evt:', evt);
});
