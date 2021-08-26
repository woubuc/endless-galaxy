<template>
	<span class="font-mono">{{ timeLabel }}</span>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue } from 'nuxt-property-decorator';
import { prefix } from '../utils/number';

@Component({
	name: 'TickOffsetCountdown',
})
export default class TickOffsetCountdown extends Vue {

	@Prop({ required: true })
	public readonly time: number;

	@Prop({ default: 'minutes' })
	public readonly interval: 'minutes' | 'hours';

	@InjectReactive()
	private readonly tickOffsetMinutes: number;

	@InjectReactive()
	private readonly tickOffsetMinutesSinceHour: number;

	private get timeLabel(): string {
		let minutes = this.time;
		if (this.interval === 'hours') {
			minutes *= 60;
		}

		if (this.interval === 'hours') {
			minutes -= this.tickOffsetMinutesSinceHour;
		} else {
			minutes -= this.tickOffsetMinutes;
		}

		if (minutes < 60) {
			return `${ minutes }m`;
		}

		let hours = Math.floor(minutes / 60);
		minutes -= (hours * 60);

		return `${ hours }h ${ prefix(minutes) }m`;
	}
}
</script>
