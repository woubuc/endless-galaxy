<template>
	<div class="px-12 py-6">

		<pre class="px-6 py-4 bg-gray-900 rounded text-xs">{{ ships }}</pre>
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
