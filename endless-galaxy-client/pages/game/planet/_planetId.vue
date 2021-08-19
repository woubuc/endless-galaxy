<template>
	<tabbed-page>
		<h1 class="mb-6 text-lg font-semibold">{{ planet.name }}</h1>

		<tabbed-page-tab
			v-if="hasSettlement"
			to="game-planet-planetId-settlement"
			:icon="require('~/assets/icons/crowd.svg?inline')"
			:title="$t('planet.settlement')"
			:subtitle="$t('planet.settlement_population', [planet.population])" />

		<tabbed-page-tab
			v-if="hasMarket"
			to="game-planet-planetId-market"
			:icon="require('~/assets/icons/change.svg?inline')"
			:title="$t('planet.market')"
			:subtitle="`${
				$tc('planet.market_sell_orders', marketSellOrders.length, [marketSellOrders.length])
			} / ${
				$tc('planet.market_buy_orders', marketBuyOrders.length, [marketBuyOrders.length])
			}`" />

		<tabbed-page-tab
			v-if="hasShipyard"
			to="game-planet-planetId-shipyard"
			:icon="require('~/assets/icons/factory.svg?inline')"
			:title="$t('planet.shipyard')"
			:subtitle="$tc('planet.shipyard_queue', shipyard.orders_count, [shipyard.orders_count])" />

		<tabbed-page-tab
			v-if="hasWarehouse"
			to="game-planet-planetId-warehouse"
			:icon="require('~/assets/icons/warehouse.svg?inline')"
			:title="$t('planet.warehouse')"
			:subtitle="$tc('planet.warehouse_inventory', warehouseInventoryCount, [warehouseInventoryCount])" />

		<tabbed-page-tab
			to="game-planet-planetId-construction"
			:icon="require('~/assets/icons/digger.svg?inline')"
			:title="$t('planet.construction')"
			:subtitle="$tc('planet.construction_activity', true)" />

	</tabbed-page>
</template>

<script lang="ts">
import { Component, InjectReactive, ProvideReactive, Vue } from 'nuxt-property-decorator';
import Planet from '~/models/Planet';

import GameButton from '~/components/GameButton.vue';
import TabbedPage from '~/components/TabbedPage.vue';
import TabbedPageTab from '~/components/TabbedPageTab.vue';
import Market from '../../../models/Market';
import MarketBuyOrder from '../../../models/MarketBuyOrder';
import MarketSellOrder from '../../../models/MarketSellOrder';
import Shipyard from '../../../models/Shipyard';
import Warehouse from '../../../models/Warehouse';
import { totalItems } from '../../../utils/inventory';

@Component({
	name: 'PlanetParentPage',
	components: { TabbedPageTab, TabbedPage, GameButton },
})
export default class PlanetParentPage extends Vue {

	@InjectReactive()
	private readonly planets: Planet[];

	@InjectReactive()
	private readonly shipyards: Shipyard[];

	@InjectReactive()
	public readonly markets: Market[];

	@InjectReactive()
	private readonly warehouses: Warehouse[];

	@InjectReactive()
	private readonly marketSellOrders: MarketSellOrder[];

	@InjectReactive()
	private readonly marketBuyOrders: MarketBuyOrder[];

	get planetId(): number {
		return parseInt(this.$route.params.planetId, 10);
	}

	@ProvideReactive()
	public get planet(): Planet {
		return this.planets.find(p => p.id === this.planetId);
	}

	@ProvideReactive()
	public get shipyard(): Shipyard | null {
		return this.shipyards.find(shipyard => shipyard.planet_id === this.planetId) ?? null;
	}

	@ProvideReactive()
	public get warehouse(): Warehouse | null {
		return this.warehouses.find(warehouse => warehouse.planet_id === this.planetId) ?? null;
	}

	public get warehouseInventoryCount(): number {
		if (this.warehouse == null) {
			return 0;
		}
		return totalItems(this.warehouse.inventory);
	}

	public get market(): Market | null {
		return this.markets.find(market => market.planet_id === this.planetId) ?? null;
	}

	get hasSettlement(): boolean {
		return this.planet.population > 0;
	}

	get hasShipyard(): boolean {
		return this.shipyard != null;
	}

	get hasMarket(): boolean {
		return this.market != null;
	}

	get hasWarehouse() {
		return this.warehouse != null;
	}

	created() {
		console.log(this.planets, this.$route.params, this.planetId, this.planet);
		if (this.planet == undefined) {
			return this.$router.back();
		}
	}
}
</script>
