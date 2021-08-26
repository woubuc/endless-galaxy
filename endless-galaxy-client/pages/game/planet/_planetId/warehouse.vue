<template>
	<div class="ml-6">
		<game-title>{{ $t('warehouse.inventory') }}</game-title>

		<div class="flex items-center space-x-4">
			<div class="flex-grow">
				<div class="h-3 bg-gray-900 bg-opacity-50 rounded overflow-hidden">
					<div
						class="h-3 bg-gradient-to-b from-violet-700 to-violet-900"
						:style="{ width: `${ filledPercentage * 100 }%` }" />
				</div>
				<p class="flex-none font-mono text-sm">{{ filled }}/{{ warehouse.capacity }}m³</p>
			</div>
			<div class="ml-2">
				<p class="font-semibold">Expand warehouse</p>
				<p class="text-xs text-gray-200 font-mono">+ 6 000 m³</p>
			</div>
			<div>
				<loading-indicator v-if="upgrading" />
				<game-button v-else size="small" @click="upgrade">
					<money-label :amount="1000000" />
				</game-button>
			</div>
		</div>

		<div class="my-6 flex flex-wrap gap-2">
			<inventory-stack-tile
				v-for="[itemType, stack] of Object.entries(warehouse.inventory)"
				:key="itemType"
				:item-type="itemType"
				:stack="stack" />
		</div>

		<game-title size="small" class="mb-2">Auto Trader</game-title>
		<div class="flex flex-wrap items-stretch gap-2">
			<warehouse-auto-trading-entry v-for="id in itemIds" :key="id" :item-type-id="id" />
		</div>

		<dev-inspect :data="warehouse" title="warehouse" />
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, mixins, Vue } from 'nuxt-property-decorator';

import Warehouse from '~/models/Warehouse';

import InventoryStackTile from '~/components/InventoryStackTile.vue';
import DevInspect from '~/components/DevInspect.vue';
import GameButton from '../../../../components/GameButton.vue';
import GameTitle from '../../../../components/GameTitle.vue';
import LoadingIndicator from '../../../../components/LoadingIndicator.vue';
import MoneyLabel from '../../../../components/MoneyLabel.vue';
import WarehouseAutoTradingEntry from '../../../../components/WarehouseAutoTradingEntry.vue';
import AwaitChangeMixin from '../../../../mixins/AwaitChangeMixin';
import ItemTypeData, { ItemTypeId } from '../../../../models/ItemTypeData';
import { request } from '../../../../utils/request';

@Component({
	name: 'WarehousePage',
	components: { WarehouseAutoTradingEntry, LoadingIndicator, MoneyLabel, GameButton, GameTitle, DevInspect, InventoryStackTile },
})
export default class WarehousePage extends mixins(AwaitChangeMixin) {

	@InjectReactive()
	private readonly warehouse: Warehouse;

	@InjectReactive()
	private readonly itemTypes: Record<ItemTypeId, ItemTypeData>;

	private upgrading: boolean = false;

	private get filled(): number {
		let total = 0;
		for (let [id, stack] of Object.entries(this.warehouse.inventory)) {
			let volume = stack.amount * this.itemTypes[id].volume;
			total += volume;
		}
		return total;
	}

	private get filledPercentage(): number {
		return this.filled / this.warehouse.capacity;
	}

	private get itemIds(): ItemTypeId[] {
		let items = Array.from(Object.keys(this.warehouse.inventory));
		for (let id of Object.keys(this.warehouse.auto_trader)) {
			if (items.indexOf(id) === -1) {
				items.push(id);
			}
		}
		return items.sort();
	}

	private async upgrade() {
		this.upgrading = true;

		let size = this.warehouse.size + 1;
		let body = { size };

		await request('patch', `warehouses/${ this.warehouse.id }`, { body, json: true });
		await this.$change('warehouse', w => w.size === size);

		this.upgrading = false;
	}
}
</script>
