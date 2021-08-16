<template>
	<nuxt-link
		:to="localePath({ name: 'game-ship-shipId', params: { shipId: ship.id }})"
		class="p-1.5 rounded border border-gray-600 hover:bg-gray-700 focus:bg-gray-700 focus-visible:ring-2 ring-cyan-500">
		<icon-space-shuttle class="h-4" />
		<div v-if="ship.target_planet_id !== null" class="mt-1 h-1 bg-gray-600 rounded-full overflow-hidden">
			<div class="h-1 bg-violet-500" :style="`width:${ ship.target_progress }%`" />
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

}
</script>
