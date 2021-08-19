<template>
	<game-container class="py-6">
		<dev-inspect :data="ships" />
	</game-container>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';
import DevInspect from '../../components/DevInspect.vue';
import GameContainer from '../../components/GameContainer.vue';
import Ship from '../../models/Ship';

@Component({
	name: 'FleetPage',
	components: { GameContainer, DevInspect },
})
export default class FleetPage extends Vue {

	@InjectReactive()
	private readonly ships: Ship[];
}
</script>
