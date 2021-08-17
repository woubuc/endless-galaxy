<template>
	<div class="flex items-center space-x-2">
		<div class="h-1 w-4 rounded-full bg-gray-700 overflow-hidden animate" :class="progress > 0 ? '' : 'animate-pulse'">
			<div class="h-1 bg-violet-500" :style="`width: ${ progress * 100 }%`" />
		</div>
		<p :class="progress > 0 ? 'text-white' : 'text-gray-300'">
			{{ $t(`shipType.${ order.ship_type }`) }}
			<span class="pl-1 text-sm text-gray-400">{{ $tc('shipyard.order_days_remaining', daysRemaining, [daysRemaining]) }}</span>
		</p>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import ShipyardOrder from '../models/ShipyardOrder';

const SHIPYARD_WORK_SPEED = 10;

@Component({
	name: 'ShipyardOrderEntry',
})
export default class ShipyardOrderEntry extends Vue {

	@Prop({ required: true }) order: ShipyardOrder;

	get progress(): number {
		if (this.order.work_remaining === this.order.total_work) {
			return 0;
		}

		return (this.order.total_work - this.order.work_remaining) / this.order.total_work;
	}

	get daysRemaining(): number {
		if (this.progress === 0) {
			return 0;
		}

		return Math.ceil(this.order.work_remaining / SHIPYARD_WORK_SPEED);
	}
}
</script>
