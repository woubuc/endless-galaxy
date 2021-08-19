<template>
	<div class="ml-6">
		<game-title>{{ $t('warehouse.inventory') }}</game-title>

		<div class="flex items-center space-x-4">
			<p class="flex-none font-mono text-sm">{{ filled }}/{{ capacity }}m³</p>
			<div class="flex-grow h-3 bg-gray-900 bg-opacity-50 rounded overflow-hidden">
				<div
					class="h-3 bg-gradient-to-b from-violet-700 to-violet-900"
					:style="{ width: `${ filledPercentage * 100 }%` }" />
			</div>
		</div>

		<div class="my-6 flex flex-wrap gap-2">
			<inventory-stack-tile
				v-for="[itemType, stack] of Object.entries(warehouse.inventory)"
				:key="itemType"
				:item-type="itemType"
				:stack="stack" />
		</div>

		<dev-inspect :data="warehouse" title="warehouse" />
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';

import Warehouse from '~/models/Warehouse';

import InventoryStackTile from '~/components/InventoryStackTile.vue';
import DevInspect from '~/components/DevInspect.vue';
import GameTitle from '../../../../components/GameTitle.vue';

@Component({
	name: 'WarehousePage',
	components: { GameTitle, DevInspect, InventoryStackTile },
})
export default class WarehousePage extends Vue {

	@InjectReactive()
	private readonly warehouse: Warehouse;

	private get capacity(): number {
		if (this.warehouse == null) {
			return 0;
		}

		return 2_000 * this.warehouse.size;
	}

	private get filled(): number {
		let total = 0;
		for (let stack of Object.values(this.warehouse.inventory)) {
			total += stack.amount;
		}
		return total;
	}

	private get filledPercentage(): number {
		return this.filled / this.capacity;
	}
}
</script>
