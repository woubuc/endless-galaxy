<template>
	<game-container class="py-6">
		<div class="divide-y-2 divide-gray-700">
			<fleet-ship-entry v-for="ship of ships" :key="ship.id" :ship="ship" />
		</div>
		<dev-inspect :data="ships" />
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

@Component({
	name: 'FleetPage',
	components: { FleetShipEntry, ItemIcon, ShipButton, GameContainer, DevInspect },
})
export default class FleetPage extends Vue {

	@InjectReactive()
	private readonly ships: Ship[];
}
</script>
