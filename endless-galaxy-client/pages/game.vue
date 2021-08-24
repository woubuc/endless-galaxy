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

		<game-container>
			<footer class="py-2 text-xs text-gray-400 text-center">
				made by <a href="https://www.woubuc.be" target="_blank"
						   class="p-0 text-gray-400 underline hover:text-gray-200">@woubuc</a>
				-
				<a href="mailto:support@endless-galaxy.com" class="p-0 text-gray-400 underline hover:text-gray-200">support</a>
				-
				icons by <a href="https://icons8.com" target="_blank"
							class="p-0 text-gray-400 underline hover:text-gray-200">icons8</a>
			</footer>
		</game-container>
	</div>
</template>

<script lang="ts">
import { Component, mixins, ProvideReactive } from 'nuxt-property-decorator';

import GameState from '~/models/GameState';
import Planet from '~/models/Planet';
import User from '~/models/User';
import { connectFeed, disconnectFeed, Feed } from '~/utils/feed';
import { request, RequestError } from '~/utils/request';
import GameContainer from '../components/GameContainer.vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import OnboardingSetCompanyNamePanel from '../components/OnboardingSetCompanyNamePanel.vue';
import TopBar from '../components/TopBar.vue';
import VerifyEmailPanel from '../components/VerifyEmailPanel.vue';
import AwaitChangeMixin from '../mixins/AwaitChangeMixin';
import { Factory } from '../models/Factory';
import FactoryTypeData, { FactoryTypeId } from '../models/FactoryTypeData';
import ItemTypeData, { ItemTypeId } from '../models/ItemTypeData';
import Market from '../models/Market';
import MarketBuyOrder from '../models/MarketBuyOrder';
import MarketSellOrder from '../models/MarketSellOrder';
import { Mine } from '../models/Mine';
import PlanetTypeData, { PlanetTypeId } from '../models/PlanetTypeData';
import Profit from '../models/Profit';
import RecipeData, { RecipeDataId } from '../models/RecipeData';
import Ship from '../models/Ship';
import ShipTypeData, { ShipTypeId } from '../models/ShipTypeData';
import Shipyard from '../models/Shipyard';
import ShipyardOrder from '../models/ShipyardOrder';
import ShopTypeData, { ShopTypeId } from '../models/ShopTypeData';
import Warehouse from '../models/Warehouse';


@Component({
	name: 'GameRootPage',
	components: { GameContainer, OnboardingSetCompanyNamePanel, VerifyEmailPanel, TopBar, LoadingIndicator },
})
export default class GameRootPage extends mixins(AwaitChangeMixin) {

	@ProvideReactive()
	@Feed()
	private user: User | null = null;

	@ProvideReactive()
	@Feed()
	private gameState: GameState | null = null;

	@ProvideReactive()
	@Feed('profit')
	public lastProfit: Profit | null = null;

	@ProvideReactive()
	@Feed('planet')
	public planets: Planet[] = [];

	@ProvideReactive()
	@Feed('ship')
	public ships: Ship[] = [];

	@ProvideReactive()
	@Feed('shipyard')
	public shipyards: Shipyard[] = [];

	@ProvideReactive()
	@Feed('shipyardOrder')
	public shipyardOrders: ShipyardOrder[] = [];

	@ProvideReactive()
	@Feed('warehouse')
	public warehouses: Warehouse[] = [];

	@ProvideReactive()
	@Feed('market')
	public markets: Market[] = [];

	@ProvideReactive()
	@Feed('marketBuyOrder')
	public marketBuyOrders: MarketBuyOrder[] = [];

	@ProvideReactive()
	@Feed('marketSellOrder')
	public marketSellOrders: MarketSellOrder[] = [];

	@ProvideReactive()
	@Feed('mine')
	public mines: Mine[] = [];

	@ProvideReactive()
	@Feed('factory')
	public factories: Factory[] = [];

	@ProvideReactive()
	public itemTypes: Record<ItemTypeId, ItemTypeData>;

	@ProvideReactive()
	public shipTypes: Record<ShipTypeId, ShipTypeData>;

	@ProvideReactive()
	public recipes: Record<RecipeDataId, RecipeData>;

	@ProvideReactive()
	public factoryTypes: Record<FactoryTypeId, FactoryTypeData>;

	@ProvideReactive()
	public planetTypes: Record<PlanetTypeId, PlanetTypeData>;

	@ProvideReactive()
	public shopTypes: Record<ShopTypeId, ShopTypeData>;

	@ProvideReactive()
	public time: number = Date.now();

	private timeInterval: NodeJS.Timeout | null = null;

	async fetch() {
		try {
			this.user = await request('get', 'user');
			await connectFeed();
			await this.$change('user', (user: User) => user.email_verified);

			this.lastProfit = await request('get', 'profits/last');

			this.planets = await request('get', 'planets');
			this.ships = await request('get', 'ships');
			this.warehouses = await request('get', 'warehouses');
			this.shipyards = await request('get', 'shipyards');
			this.shipyardOrders = await request('get', 'shipyard-orders');
			this.markets = await request('get', 'markets');
			this.marketBuyOrders = await request('get', 'market-buy-orders');
			this.marketSellOrders = await request('get', 'market-sell-orders');
			this.factories = await request('get', 'factories');

			this.shipTypes = await request('get', 'data/ship-types');
			this.itemTypes = await request('get', 'data/item-types');
			this.recipes = await request('get', 'data/recipes');
			this.factoryTypes = await request('get', 'data/factory-types');
			this.planetTypes = await request('get', 'data/planet-types');
			this.shopTypes = await request('get', 'data/shop-types');
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
