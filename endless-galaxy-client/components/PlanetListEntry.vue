<template>
	<div class="sm:flex items-start space-y-2 sm:space-y-0 sm:space-x-10 py-6">
		<div class="flex-1 flex items-start space-x-4">
			<div class="w-12 h-12 rounded-full bg-gradient-to-br" :class="planetColour" />
			<div>
				<p class="font-semibold">{{ planet.name }}</p>
<!--				<p class="text-xs font-semibold text-gray-400 font-mono">-->
<!--					{{ planet.x }},{{ planet.y }},{{ planet.z }}-->
<!--				</p>-->
				<p class="flex items-center space-x-1 text-gray-400">
					<icon-crowd v-if="hasPopulation" class="h-5" :title="$t('planet.has_settlement')" />
					<icon-factory v-if="hasShipyard" class="h-5" :title="$t('planet.has_shipyard')" />
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
				<ship-button v-for="ship of dockedShips" :ship="ship" />
			</div>
		</div>
		<div class="flex-1">
			<p class="mb-1 text-gray-400 font-semibold">{{ $t('planet.ships_targeting') }}</p>
			<div class="flex flex-wrap gap-1">
				<ship-button v-for="ship of targetingShips" :ship="ship" />
			</div>
		</div>

		<game-button to="game-planet-planetId" :planet-id="planet.id + 1" size="small">
			View planet details
		</game-button>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue } from 'nuxt-property-decorator';

import Planet from '~/models/Planet';
import Ship from '~/models/Ship';
import Shipyard from '../models/Shipyard';
import GameButton from './GameButton.vue';

import ShipButton from './ShipButton.vue';

import IconCrowd from '~/assets/icons/crowd.svg?inline';
import IconFactory from '~/assets/icons/factory.svg?inline';

const PLANET_COLOURS = [
	'from-orange-500 to-orange-900',
	'from-blue-500 to-blue-900',
	'from-emerald-500 to-emerald-900',
];

@Component({
	name: 'PlanetListEntry',
	components: { GameButton, ShipButton, IconCrowd, IconFactory },
})
export default class PlanetListEntry extends Vue {

	@Prop({ required: true })
	public readonly planet: Planet;

	@InjectReactive()
	public readonly ships: Ship[];

	@InjectReactive()
	public readonly shipyards: Shipyard[];

	get planetColour(): string {
		return PLANET_COLOURS[this.planet.id % PLANET_COLOURS.length];
	}

	get planetShips(): Ship[] {
		return this.ships.filter(ship => ship.planet_id === this.planet.id);
	}

	get dockedShips(): Ship[] {
		return this.planetShips.filter(ship => !ship.movement_distance_remaining);
	}

	get targetingShips(): Ship[] {
		return this.planetShips.filter(ship => !!ship.movement_distance_remaining);
	}

	get hasPopulation(): boolean {
		return this.planet.population > 0;
	}

	get hasShipyard(): boolean {
		return this.shipyards.some(shipyard => shipyard.planet_id === this.planet.id);
	}
}
</script>
