<template>
	<loading-indicator class="h-screen" v-if="!user" />
	<onboarding-set-company-name-panel v-else-if="!user.company_name" />
	<div v-else-if="!user.email_verified" class="h-screen pb-6 flex items-center justify-center">
		<verify-email-panel />
	</div>
	<loading-indicator class="h-screen" v-else-if="$fetchState.pending || gameState == null" />
	<div v-else class="w-full min-h-screen flex flex-col items-stretch">
		<top-bar />
		<nuxt-child class="flex-grow" />
		<footer class="px-12 py-2 text-xs text-gray-400 text-center">
			made by <a href="https://www.woubuc.be" target="_blank" class="p-0 text-gray-400 underline hover:text-gray-200">@woubuc</a>
			-
			<a href="mailto:support@endless-galaxy.com" class="p-0 text-gray-400 underline hover:text-gray-200">support</a>
			-
			icons by <a href="https://icons8.com" target="_blank"  class="p-0 text-gray-400 underline hover:text-gray-200">icons8</a>
		</footer>
	</div>
</template>

<script lang="ts">
import { Component, mixins, ProvideReactive, Vue } from 'nuxt-property-decorator';

import GameState from '~/models/GameState';
import Planet from '~/models/Planet';
import User from '~/models/User';
import { connectFeed, disconnectFeed, Feed } from '~/utils/feed';
import { request, RequestError } from '~/utils/request';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import OnboardingSetCompanyNamePanel from '../components/OnboardingSetCompanyNamePanel.vue';
import TopBar from '../components/TopBar.vue';
import VerifyEmailPanel from '../components/VerifyEmailPanel.vue';
import AwaitChangeMixin from '../mixins/AwaitChangeMixin';
import Profit from '../models/Profit';
import Ship from '../models/Ship';

@Component({
	name: 'GameRootPage',
	components: { OnboardingSetCompanyNamePanel, VerifyEmailPanel, TopBar, LoadingIndicator },
})
export default class GameRootPage extends mixins(AwaitChangeMixin) {

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
			this.user = await request('get', 'user');
			await connectFeed();
			await this.$change('user', (user: User) => user.email_verified);
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
