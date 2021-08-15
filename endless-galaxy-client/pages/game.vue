<template>
	<loading-indicator class="h-screen" v-if="$fetchState.pending || gameState == null" />
	<div v-else class="w-full min-h-screen flex flex-col items-stretch">
		<top-bar />
		<nuxt-child class="flex-grow" />
		<footer class="px-12 py-2 text-xs text-gray-400 text-center">
			made by <a href="https://www.woubuc.be" target="_blank" class="p-0 text-gray-400 underline hover:text-gray-200">@woubuc</a>
			-
			icons by <a href="https://icons8.com" target="_blank"  class="p-0 text-gray-400 underline hover:text-gray-200">icons8</a>
		</footer>
	</div>
</template>

<script lang="ts">
import { Component, ProvideReactive, Vue } from 'nuxt-property-decorator';

import GameState from '~/models/GameState';
import Planet from '~/models/Planet';
import User from '~/models/User';
import { connectFeed, disconnectFeed, Feed } from '~/utils/feed';
import { request, RequestError } from '~/utils/request';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import TopBar from '../components/TopBar.vue';
import Profit from '../models/Profit';
import Ship from '../models/Ship';

@Component({
	name: 'GameRootPage',
	components: { TopBar, LoadingIndicator },
})
export default class GameRootPage extends Vue {

	@ProvideReactive()
	@Feed()
	private user: User | null = null;

	@ProvideReactive()
	@Feed()
	private gameState: GameState | null = null;

	@ProvideReactive()
	@Feed('planet')
	public planets: Planet[] = [];

	@ProvideReactive()
	@Feed('ship')
	public ships: Ship[] = [];

	@ProvideReactive()
	@Feed('profit')
	public lastProfit: Profit | null = null;

	@ProvideReactive()
	public time: number = Date.now();

	private timeInterval: NodeJS.Timeout | null = null;

	async fetch() {
		try {
			this.user = await request('get', 'auth/me');
			await connectFeed();
			this.lastProfit = await request('get', 'profit/last');
			this.planets = await request('get', 'planet');
			this.ships = await request('get', 'ship');
		} catch (err) {
			if (err instanceof RequestError && err.status === 401) {
				return this.$router.replace(this.localePath({ name: 'login' }));
			}

			throw err;
		}
	}

	mounted() {
		this.timeInterval = setInterval(() => this.time = Date.now(), 100);
	}

	beforeDestroy() {
		if (this.timeInterval !== null) {
			clearInterval(this.timeInterval);
		}

		disconnectFeed();
	}
}
</script>
