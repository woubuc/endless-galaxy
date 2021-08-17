<template>
	<label class="flex items-center space-x-2 my-0 -mx-2 px-2 py-1 cursor-pointer hover:bg-gray-700 focus:bg-gray-700 focus-visible:ring-2 ring-cyan-500 rounded">
		<input type="radio" name="shipTypeId" :value="shipTypeId">
		<span class="block">
			<span class="flex items-center space-x-2">
				<component :is="icon" class="h-5" />
				<span class="inline text-base text-white">{{ $t(`shipType.${ shipTypeId }`) }}</span>
			</span>
			<span class="flex space-x-3 text-gray-300 text-sm">
				<span>{{ $t('shipyard.ship_volume', [shipTypes[shipTypeId].capacity]) }}</span>
				<span>{{ $t('shipyard.ship_speed', [shipTypes[shipTypeId].speed]) }}</span>
				<span>¢{{ $t('shipyard.ship_run_cost', [Math.round(shipTypes[shipTypeId].runCost / 100)]) }}</span>
			</span>
		</span>
	</label>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue } from 'nuxt-property-decorator';
import ShipTypeData from '../models/ShipTypeData';
import MoneyLabel from './MoneyLabel.vue';

@Component({
	name: 'ShipyardShipTypeOption',
	components: { MoneyLabel },
})
export default class ShipyardShipTypeOption extends Vue {

	@Prop({ required: true }) shipTypeId: string;
	@Prop({ required: true }) icon: Vue;

	@InjectReactive()
	private readonly shipTypes: Record<string, ShipTypeData>;
}
</script>
