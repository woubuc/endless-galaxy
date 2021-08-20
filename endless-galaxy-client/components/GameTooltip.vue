<template>
	<div class="group relative">
		<div class="absolute z-50 left-full top-0 flex items-center h-full pl-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
			<div class="px-1.5 py-0.5 bg-black text-gray-100 bg-opacity-80 rounded text-sm whitespace-nowrap">
				{{ text }}
			</div>
		</div>

		<slot />
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component({
	name: 'GameTooltip',
})
export default class GameTooltip extends Vue {

	@Prop({ required: true })
	public readonly text: string;
}
</script>
