<template>
	<div class="GameClock font-mono">
		<div class="flex items-center text-lg">
			<span class="font-semibold">{{ hour }}:{{ minute }}</span>
			<span class="flex-grow" />
			<circle-progress :progress="progressToNextHour" />
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
import { prefix } from '../utils/number';
import CircleProgress from './CircleProgress.vue';

@Component({
	name: 'TopBarDate',
	components: { CircleProgress },
})
export default class TopBarDate extends Vue {

	@InjectReactive()
	private readonly gameState: GameState;

	@InjectReactive()
	private readonly progressToNextHour: number;

	@InjectReactive()
	private readonly tickOffsetMinutesSinceHour: number;

	private get hour(): string {
		return prefix(this.gameState.hour);
	}

	private get minute(): string {
		return prefix(this.tickOffsetMinutesSinceHour);
	}
}
</script>
