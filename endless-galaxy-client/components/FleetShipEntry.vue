<template>
	<div class="flex items-center space-x-6 py-2">
		<nuxt-link
			class="block p-1.5 bg-gray-900 rounded"
			:to="localePath({ name: 'game-ship-shipId', params: { shipId }})">
			<component
				:is="ship.ship_type === 'hauler' ? require('~/assets/icons/shipping-container.svg?inline') : require('~/assets/icons/space-shuttle.svg?inline')"
				class="h-6 text-gray-100" />
		</nuxt-link>

		<p class="whitespace-nowrap pr-4">
			<span v-if="ship.movement_minutes == null">At</span>
			<span v-else>Traveling to</span>
			<nuxt-link :to="localePath({ name: 'game-planet-planetId', params: { planetId: ship.planet_id }})">
				{{ planetName }}
			</nuxt-link>
			<span v-if="ship.movement_minutes_remaining > 0"
				  class="text-gray-300 text-sm pl-1">(<tick-offset-countdown :time="ship.movement_minutes_remaining" interval="minutes" />)</span>
		</p>

		<div v-for="[id, stack] in Object.entries(ship.inventory)" :key="id" class="flex items-center">
			<span class="font-mono text-sm text-gray-200">{{ stack.amount }}</span>
			<item-icon :item-type-id="id" />
		</div>

		<span class="flex-grow" />

		<game-button size="small" to="game-ship-shipId" :ship-id="shipId">View ship</game-button>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue } from 'nuxt-property-decorator';
import Planet from '~/models/Planet';
import Ship from '~/models/Ship';
import GameButton from './GameButton.vue';
import ItemIcon from './ItemIcon.vue';
import TickOffsetCountdown from './TickOffsetCountdown.vue';

@Component({
	name: 'FleetShipEntry',
	components: { TickOffsetCountdown, GameButton, ItemIcon },
})
export default class FleetShipEntry extends Vue {

	@Prop({ required: true })
	public readonly ship: Ship;

	@InjectReactive()
	private readonly planets: Planet[];

	private get shipId(): number {
		return this.ship.id;
	}

	private get planetName(): string {
		return this.planets.find(p => p.id === this.ship.planet_id).name;
	}
}
</script>
