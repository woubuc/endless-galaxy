<template>
	<div>
		<game-title>{{ $t('planet.buildings') }}</game-title>

		<game-title size="small">{{ $t('planet.buildings_factories') }}</game-title>

		<factory-list-entry v-for="factory of planetFactories" :key="factory.id" :factory="factory" />

		<dev-inspect :data="planetFactories" title="factories" />

		<game-title size="small">{{ $t('planet.buildings_shops') }}</game-title>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';
import { Factory } from '~/models/Factory';
import DevInspect from '~/components/DevInspect.vue';
import GameTitle from '~/components/GameTitle.vue';
import FactoryListEntry from '../../../../components/FactoryListEntry.vue';
import GameButton from '../../../../components/GameButton.vue';

@Component({
	name: 'PlayerBuildingsPage',
	components: { FactoryListEntry, GameButton, GameTitle, DevInspect },
})
export default class PlayerBuildingsPage extends Vue {

	@InjectReactive()
	private readonly planetFactories: Factory[];
}
</script>
