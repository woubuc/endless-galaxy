<template>
	<div class="px-12 py-6">
		<div class="divide-y-2 divide-gray-600">
			<planet-list-entry v-for="planet of planets" :key="planet.id" :planet="planet" />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';

import Planet from '~/models/Planet';

import LoadingIndicator from '~/components/LoadingIndicator.vue';
import PlanetListEntry from '../../components/PlanetListEntry.vue';

@Component({
	name: 'GameOverviewPage',
	components: { PlanetListEntry, LoadingIndicator },
})
export default class GameOverviewPage extends Vue {

	@InjectReactive()
	private readonly planets: Planet[];
}
</script>
