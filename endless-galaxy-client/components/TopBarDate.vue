<template>
	<div class="GameClock font-mono">
		<div class="flex items-center text-lg">
			<span class="font-semibold">{{ prefix(gameState.hour) }}:{{ prefix(gameState.minute) }}</span>
			<span class="flex-grow" />
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
					:stroke-dashoffset="progressToNextTick" />
			</svg>
		</div>
		<div class="flex text-sm text-gray-200">
			<span class="text-gray-400">D</span>
			<span class="font-semibold">{{ gameState.day }}</span>
			<span class="w-2" />
			<span class="text-gray-400">W</span>
			<span class="font-semibold">{{ gameState.week }}</span>
			<span class="w-2" />
			<span class="text-gray-400">M</span>
			<span class="font-semibold">{{ gameState.month }}</span>
			<span class="w-2" />
			<span class="text-gray-400">Y</span>
			<span class="font-semibold">{{ gameState.year }}</span>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';

import GameState from '~/models/GameState';

const PROGRESS_RADIUS: number = 12;
const PROGRESS_CIRCUMFERENCE: number = Math.PI * (PROGRESS_RADIUS * 2);

@Component({
	name: 'TopBarDate',
})
export default class TopBarDate extends Vue {

	@InjectReactive()
	private readonly gameState: GameState;

	@InjectReactive()
	private readonly time: number;

	get progressRadius(): number {
		return PROGRESS_RADIUS;
	}

	get progressCircumference(): number {
		return PROGRESS_CIRCUMFERENCE;
	}

	get progressToNextTick(): number {
		let timeUntilNextHour = this.gameState.next_hour - (this.time / 1000);
		if (timeUntilNextHour <= 0) {
			return 0;
		}

		let timeSinceLastHour = (this.time / 1000) - this.gameState.last_hour;
		let hourTime = timeSinceLastHour + timeUntilNextHour;

		let progress = timeUntilNextHour / hourTime;
		if (progress <= 0) {
			return 0;
		}

		return progress * PROGRESS_CIRCUMFERENCE;
	}

	private prefix(num: number): string {
		if (num < 10) {
			return `0${ num }`;
		} else {
			return num.toString();
		}
	}
}
</script>
