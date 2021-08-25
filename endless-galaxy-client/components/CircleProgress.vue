<template>
	<svg class="h-4 w-4" viewBox="0 0 32 32">
		<circle
			:r="progressRadius + 1"
			cx="16"
			cy="16"
			fill="transparent"
			class="text-gray-600"
			stroke="currentColor"
			stroke-width="4" />
		<circle
			:r="progressRadius"
			cx="16"
			cy="16"
			fill="transparent"
			class="text-violet-500 transition transition-all"
			stroke="currentColor"
			stroke-width="4"
			:stroke-dasharray="progressCircumference"
			:stroke-dashoffset="progressOffset" />
	</svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

const PROGRESS_RADIUS: number = 12;
const PROGRESS_CIRCUMFERENCE: number = Math.PI * (PROGRESS_RADIUS * 2);

@Component({
	name: 'CircleProgress',
})
export default class CircleProgress extends Vue {

	@Prop({ required: true })
	public readonly progress: number;

	private get progressRadius(): number {
		return PROGRESS_RADIUS;
	}

	private get progressCircumference(): number {
		return PROGRESS_CIRCUMFERENCE;
	}

	private get progressOffset(): number {
		return (1 - this.progress) * PROGRESS_CIRCUMFERENCE;
	}
}
</script>
