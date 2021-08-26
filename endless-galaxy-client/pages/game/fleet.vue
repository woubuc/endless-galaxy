<template>
	<game-container class="py-6">
		<div class="divide-y-2 divide-gray-700">
			<fleet-ship-entry v-for="ship of filteredShips" :key="ship.id" :ship="ship" />
		</div>
		<dev-inspect :data="filteredShips" />
	</game-container>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';
import DevInspect from '~/components/DevInspect.vue';
import FleetShipEntry from '~/components/FleetShipEntry.vue';
import GameContainer from '~/components/GameContainer.vue';
import ItemIcon from '~/components/ItemIcon.vue';
import ShipButton from '~/components/ShipButton.vue';
import Ship from '~/models/Ship';
import GameButton from '../../components/GameButton.vue';

@Component({
	name: 'FleetPage',
	components: { GameButton, FleetShipEntry, ItemIcon, ShipButton, GameContainer, DevInspect },
})
export default class FleetPage extends Vue {

	@InjectReactive()
	private readonly ships: Ship[];

	private get filteredShips(): Ship[] {
		return this.ships.sort((a, b) => a.id - b.id);
	}
}
</script>
