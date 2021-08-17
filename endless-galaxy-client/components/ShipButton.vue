<template>
	<nuxt-link
		:to="localePath({ name: 'game-ship-shipId', params: { shipId: ship.id } })"
		class="p-1.5 rounded border border-gray-600 hover:bg-gray-700 focus:bg-gray-700 focus-visible:ring-2 ring-cyan-500">
		<component :is="icon" class="h-4" />
		<div v-if="ship.movement_distance_remaining !== null" class="mt-1 h-1 bg-gray-600 rounded-full overflow-hidden">
			<div class="h-1 bg-violet-500" :style="`width:${ movementProgress * 100 }%`" />
		</div>
	</nuxt-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import IconSpaceShuttle from '~/assets/icons/space-shuttle.svg?inline';
import Ship from '../models/Ship';

@Component({
	name: 'ShipButton',
	components: { IconSpaceShuttle },
})
export default class ShipButton extends Vue {

	@Prop({ required: true }) public readonly ship: Ship;

	get icon(): Vue {
		switch (this.ship.ship_type) {
			case 'hauler': return require('~/assets/icons/shipping-container.svg?inline');
			default: return require('~/assets/icons/space-shuttle.svg?inline');
		}
	}

	get movementProgress(): number {
		return (this.ship.movement_distance - this.ship.movement_distance_remaining) / this.ship.movement_distance;
	}

}
</script>
