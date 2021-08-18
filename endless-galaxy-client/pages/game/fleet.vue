<template>
	<div class="px-12 py-6">
		<dev-inspect :data="ships" />
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';
import DevInspect from '../../components/DevInspect.vue';
import Ship from '../../models/Ship';

@Component({
	name: 'FleetPage',
	components: { DevInspect },
})
export default class FleetPage extends Vue {

	@InjectReactive()
	private readonly ships: Ship[];
}
</script>
