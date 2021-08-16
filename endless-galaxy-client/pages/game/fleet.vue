<template>
	<div class="FleetPage">
{{ ships }}
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';
import Ship from '../../models/Ship';

@Component({
	name: 'FleetPage',
})
export default class FleetPage extends Vue {

	@InjectReactive()
	private readonly ships: Ship[];
}
</script>
