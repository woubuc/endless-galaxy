<template>
	<div>
		<game-title>{{ $t('planet.ships') }}</game-title>
		<div class="flex">
			<ship-button v-for="ship of planetShips" :key="ship.id" :ship="ship" />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';
import GameTitle from '../../../../components/GameTitle.vue';
import ShipButton from '../../../../components/ShipButton.vue';
import Ship from '../../../../models/Ship';

@Component({
	name: 'PlanetShipsPage',
	components: { GameTitle, ShipButton },
})
export default class PlanetShipsPage extends Vue {

	@InjectReactive()
	private readonly planetShips: Ship[];
}
</script>
