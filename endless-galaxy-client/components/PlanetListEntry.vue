<template>
	<div class="flex items-center space-x-4 py-6">
		<div class="w-12 h-12 rounded-full bg-gradient-to-br" :class="planetColour" />
		<div>
			<p class="font-semibold">{{ planet.name }}</p>
			<p class="text-xs font-semibold text-gray-400 font-mono">
				{{ planet.x }}.{{ planet.y }}.{{ planet.z }}
			</p>
		</div>
		<p>#{{ planet.id }}: {{ planet }}</p>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import Planet from '~/models/Planet';

const PLANET_COLOURS = [
	'from-orange-500 to-orange-900',
	'from-blue-500 to-blue-900',
	'from-emerald-500 to-emerald-900',
];

@Component({
	name: 'PlanetListEntry',
})
export default class PlanetListEntry extends Vue {

	@Prop({ required: true })
	public readonly planet: Planet;

	get planetColour(): string {
		return PLANET_COLOURS[this.planet.id % PLANET_COLOURS.length];
	}

}
</script>
