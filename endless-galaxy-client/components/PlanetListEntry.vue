<template>
	<div class="sm:flex items-start space-y-2 sm:space-y-0 sm:space-x-10 py-6">
		<div class="flex-1 flex items-start space-x-4">
			<nuxt-link
				:to="localePath({ name: 'game-planet-planetId', params: { planetId: planet.id }})"
				class="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br"
				:class="planetColour">
				<game-tooltip v-if="hasWarehouse" :text="$t('planet.has_warehouse')">
					<icon-warehouse class="h-5 text-white text-opacity-60" />
				</game-tooltip>
			</nuxt-link>
			<div>
				<p class="font-semibold">{{ planet.name }}</p>
				<p class="flex items-center space-x-1 text-gray-400">
					<game-tooltip v-if="hasPopulation" :text="$t('planet.has_population')">
						<icon-crowd class="h-5" />
					</game-tooltip>
					<game-tooltip v-if="hasMarket" :text="$t('planet.has_market')">
						<icon-change class="h-5" />
					</game-tooltip>
					<game-tooltip v-if="hasShipyard" :text="$t('planet.has_shipyard')">
						<icon-factory class="h-5" />
					</game-tooltip>
				</p>
			</div>
		</div>
		<div class="flex-1">
			<p class="mb-1 text-gray-400 font-semibold">{{ $t('planet.buildings') }}</p>
			<div class="flex flex-wrap gap-1">
				<p class="text-xs font-light text-gray-200">not implemented yet</p>
			</div>
		</div>
		<div class="flex-1">
			<p class="mb-1 text-gray-400 font-semibold">{{ $t('planet.ships') }}</p>
			<div class="flex flex-wrap gap-1">
				<ship-button v-for="ship of dockedShips" :key="ship.id" :ship="ship" />
			</div>
		</div>
		<div class="flex-1">
			<p class="mb-1 text-gray-400 font-semibold">{{ $t('planet.ships_targeting') }}</p>
			<div class="flex flex-wrap gap-1">
				<ship-button v-for="ship of targetingShips" :key="ship.id" :ship="ship" />
			</div>
		</div>

		<game-button to="game-planet-planetId" :planet-id="planet.id" size="small">
			View planet details
		</game-button>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue } from 'nuxt-property-decorator';

import Planet from '~/models/Planet';
import Ship from '~/models/Ship';
import Market from '~/models/Market';
import Shipyard from '~/models/Shipyard';
import Warehouse from '../models/Warehouse';

import GameButton from './GameButton.vue';
import GameTooltip from './GameTooltip.vue';
import ShipButton from './ShipButton.vue';

import IconChange from '~/assets/icons/change.svg?inline';
import IconCrowd from '~/assets/icons/crowd.svg?inline';
import IconFactory from '~/assets/icons/factory.svg?inline';
import IconWarehouse from '~/assets/icons/warehouse.svg?inline';

const PLANET_COLOURS: Record<string, string> = {
	water: 'from-blue-500 to-blue-900',
	earth_like: 'from-emerald-500 to-emerald-900',
	forest: 'from-green-700 to-green-900',
	desert: 'from-orange-500 to-orange-900',
	gas: 'from-cyan-400 to-teal-800',
};

@Component({
	name: 'PlanetListEntry',
	components: { GameTooltip, GameButton, ShipButton, IconChange, IconCrowd, IconFactory, IconWarehouse },
})
export default class PlanetListEntry extends Vue {

	@Prop({ required: true })
	public readonly planet: Planet;

	@InjectReactive()
	public readonly ships: Ship[];

	@InjectReactive()
	public readonly shipyards: Shipyard[];

	@InjectReactive()
	public readonly markets: Market[];

	@InjectReactive()
	public readonly warehouses: Warehouse[];

	get planetColour(): string {
		return PLANET_COLOURS[this.planet.planet_type];
	}

	get planetShips(): Ship[] {
		return this.ships.filter(ship => ship.planet_id === this.planet.id);
	}

	get dockedShips(): Ship[] {
		return this.planetShips.filter(ship => !ship.movement_minutes_remaining);
	}

	get targetingShips(): Ship[] {
		return this.planetShips.filter(ship => !!ship.movement_minutes_remaining);
	}

	get hasPopulation(): boolean {
		return this.planet.population > 0;
	}

	get hasShipyard(): boolean {
		return this.shipyards.some(shipyard => shipyard.planet_id === this.planet.id);
	}

	get hasMarket(): boolean {
		return this.markets.some(market => market.planet_id === this.planet.id);
	}

	get hasWarehouse(): boolean {
		return this.warehouses.some(warehouse => warehouse.planet_id === this.planet.id);
	}
}
</script>
