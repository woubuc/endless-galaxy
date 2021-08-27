<template>
	<tabbed-page>
		<h1 class="mb-6 text-lg font-semibold">{{ planet.name }}</h1>

		<tabbed-page-tab
			to="game-planet-planetId"
			:icon="require('~/assets/icons/planet.svg?inline')"
			:title="$t('planet.planet')"
			:subtitle="$tc('planet.ships_count', planetShips.length, [planetShips.length])" />

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
				$tc('planet.market_sell_orders', planetMarketSellOrders.length, [planetMarketSellOrders.length])
			} / ${
				$tc('planet.market_buy_orders', planetMarketBuyOrders.length, [planetMarketBuyOrders.length])
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
			v-if="hasBuildings"
			to="game-planet-planetId-buildings"
			:icon="require('~/assets/icons/group-of-companies.svg?inline')"
			:title="$t('planet.buildings')"
			:subtitle="$tc('planet.buildings_idle', idleFactoryCount, [idleFactoryCount])" />

		<tabbed-page-tab
			to="game-planet-planetId-construction"
			:icon="require('~/assets/icons/digger.svg?inline')"
			:title="$t('planet.construction')"
			:subtitle="$tc('planet.construction_activity', true)" />

	</tabbed-page>
</template>

<script lang="ts">
import { Component, InjectReactive, Provide, ProvideReactive, Vue } from 'nuxt-property-decorator';

import GameButton from '~/components/GameButton.vue';
import TabbedPage from '~/components/TabbedPage.vue';
import TabbedPageTab from '~/components/TabbedPageTab.vue';

import { Factory } from '~/models/Factory';
import Market from '~/models/Market';
import MarketBuyOrder from '~/models/MarketBuyOrder';
import MarketSellOrder from '~/models/MarketSellOrder';
import Planet from '~/models/Planet';
import PlanetTypeData, { PlanetTypeId } from '~/models/PlanetTypeData';
import Ship from '~/models/Ship';
import Shipyard from '~/models/Shipyard';
import Warehouse from '~/models/Warehouse';
import { totalItems } from '~/utils/inventory';

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

	@InjectReactive()
	private readonly factories: Factory[];

	@InjectReactive()
	private readonly planetTypes: Record<PlanetTypeId, PlanetTypeData>;

	@InjectReactive()
	private readonly ships: Ship[];

	@ProvideReactive()
	get planetId(): number {
		return parseInt(this.$route.params.planetId, 10);
	}

	@ProvideReactive()
	public get planet(): Planet {
		return this.planets.find(p => p.id === this.planetId);
	}

	@ProvideReactive()
	public get planetType(): PlanetTypeData {
		return this.planetTypes[this.planet.planet_type];
	}

	@ProvideReactive()
	public get planetShips(): Ship[] {
		return this.ships.filter(s => s.planet_id === this.planetId);
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

	@ProvideReactive()
	public get planetFactories(): Factory[] {
		return this.factories.filter(factory => factory.planet_id === this.planetId);
	}

	private get idleFactoryCount(): number {
		return this.planetFactories.filter(factory => factory.recipe == null).length;
	}

	@ProvideReactive()
	public get planetMarket(): Market | null {
		return this.markets.find(market => market.planet_id === this.planetId) ?? null;
	}

	@ProvideReactive()
	public get planetMarketSellOrders(): MarketSellOrder[] {
		if (this.planetMarket === null) {
			return [];
		}
		return this.marketSellOrders.filter(o => o.market_id === this.planetMarket.id);
	}

	@ProvideReactive()
	public get planetMarketBuyOrders(): MarketSellOrder[] {
		if (this.planetMarket === null) {
			return [];
		}
		return this.marketBuyOrders.filter(o => o.market_id === this.planetMarket.id);
	}

	@ProvideReactive()
	public get hasSettlement(): boolean {
		return this.planet.population > 0;
	}

	@ProvideReactive()
	public get hasShipyard(): boolean {
		return this.shipyard != null;
	}

	@ProvideReactive()
	public get hasMarket(): boolean {
		return this.planetMarket != null;
	}

	@ProvideReactive()
	public get hasWarehouse(): boolean {
		return this.warehouse != null;
	}

	@ProvideReactive()
	public get hasBuildings(): boolean {
		return this.planetFactories.length > 0;
	}

	created() {
		if (this.planet == undefined) {
			return this.$router.back();
		}
	}
}
</script>
