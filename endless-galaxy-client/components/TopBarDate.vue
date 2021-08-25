<template>
	<div class="GameClock font-mono">
		<div class="flex items-center text-lg">
			<span class="font-semibold">{{ prefix(gameState.hour) }}:{{ prefix(gameState.minute) }}</span>
			<span class="flex-grow" />
			<circle-progress :progress="progressToNextTick" />
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
import CircleProgress from './CircleProgress.vue';

@Component({
	name: 'TopBarDate',
	components: { CircleProgress },
})
export default class TopBarDate extends Vue {

	@InjectReactive()
	private readonly gameState: GameState;

	@InjectReactive()
	private readonly time: number;

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

		return progress;
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
