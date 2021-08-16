<template>
	<div class="px-6">
		<pre>// TODO</pre>
		<pre>{{ shipyard }}</pre>

		<game-button @click="orderShip = true">Order ship</game-button>
		<p v-if="orderShip">Yeah, nah, that's not gonna work. Wait until it's implemented.</p>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';

import Shipyard from '~/models/Shipyard';
import GameButton from '~/components/GameButton.vue';

@Component({
	name: 'PlanetShipyardPage',
	components: { GameButton },
})
export default class PlanetShipyardPage extends Vue {

	@InjectReactive()
	private readonly shipyard: Shipyard;

	private orderShip = false;
}
</script>
