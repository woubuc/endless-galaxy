<template>
	<tabbed-page>
		<h1 class="mb-6 text-lg font-semibold">{{ planet.name }}</h1>

		<tabbed-page-tab
			v-if="hasSettlement"
			to="game-planet-planetId"
			:icon="require('~/assets/icons/crowd.svg?inline')"
			:title="$t('planet.population')"
			:subtitle="$t('planet.population_people', [planet.population])" />

		<tabbed-page-tab
			v-if="hasShipyard"
			to="game-planet-planetId-shipyard"
			:icon="require('~/assets/icons/factory.svg?inline')"
			:title="$t('planet.shipyard')"
			:subtitle="$tc('planet.shipyard_queue', shipyard.orders_count, [shipyard.orders_count])" />

	</tabbed-page>
</template>

<script lang="ts">
import { Component, InjectReactive, ProvideReactive, Vue } from 'nuxt-property-decorator';
import Planet from '~/models/Planet';

import GameButton from '~/components/GameButton.vue';
import TabbedPage from '~/components/TabbedPage.vue';
import TabbedPageTab from '~/components/TabbedPageTab.vue';
import Shipyard from '../../../models/Shipyard';

@Component({
	name: 'PlanetParentPage',
	components: { TabbedPageTab, TabbedPage, GameButton },
})
export default class PlanetParentPage extends Vue {

	@InjectReactive()
	private readonly planets: Planet[];

	@InjectReactive()
	private readonly shipyards: Shipyard[];

	get planetId(): number {
		return parseInt(this.$route.params.planetId, 10);
	}

	@ProvideReactive()
	public get planet(): Planet {
		return this.planets.find(p => p.id === this.planetId);
	}

	@ProvideReactive()
	public get shipyard(): Shipyard | null {
		return this.shipyards.find(s => s.planet_id === this.planetId) ?? null;
	}

	get hasSettlement(): boolean {
		return this.planet.population > 0;
	}

	get hasShipyard(): boolean {
		return this.shipyard != null;
	}

	created() {
		console.log(this.planets, this.$route.params, this.planetId, this.planet);
		if (this.planet == undefined) {
			return this.$router.back();
		}
	}
}
</script>
