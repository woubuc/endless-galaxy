<template>
	<div>
		<game-title>{{ $t('planet.buildings') }}</game-title>

		<game-title size="small">{{ $t('planet.buildings_factories') }}</game-title>

		<div v-for="factory of planetFactories" :key="factory.id" class="flex items-center py-2 space-x-4">
			<p class="font-semibold">{{ $t(`factoryType.${ factory.factory_type }`) }}</p>
			<p v-if="factory.recipe === null" class="text-gray-500">{{ $t('building.idle') }}</p>
			<p v-else>{{ factory.recipe }}</p>
			<span class="flex-grow" />
			<game-button size="small" to="game-planet-planetId-factories-factoryId" :factory-id="factory.id">View</game-button>
		</div>

		<dev-inspect :data="planetFactories" title="factories" />

		<game-title size="small">{{ $t('planet.buildings_shops') }}</game-title>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';
import { Factory } from '~/models/Factory';
import DevInspect from '~/components/DevInspect.vue';
import GameTitle from '~/components/GameTitle.vue';
import GameButton from '../../../../components/GameButton.vue';

@Component({
	name: 'PlayerBuildingsPage',
	components: { GameButton, GameTitle, DevInspect },
})
export default class PlayerBuildingsPage extends Vue {

	@InjectReactive()
	private readonly planetFactories: Factory[];
}
</script>
