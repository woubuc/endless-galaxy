<template>
	<construction-tile
		building-id="warehouse"
		:cost="warehouseBuildCost"
		:loading="loading"
		:level="warehouse === null ? 0 : warehouse.size"
		@build="buildWarehouse">
		<p class="font-mono text-gray-300">6 000m³</p>
	</construction-tile>
</template>

<script lang="ts">
import { Component, InjectReactive, mixins } from 'nuxt-property-decorator';

import AwaitChangeMixin from '~/mixins/AwaitChangeMixin';
import Planet from '~/models/Planet';
import Warehouse from '~/models/Warehouse';
import { request } from '~/utils/request';
import ConstructionTile from './ConstructionTile.vue';

import GameButton from './GameButton.vue';
import LoadingIndicator from './LoadingIndicator.vue';
import MoneyLabel from './MoneyLabel.vue';

const WAREHOUSE_BUILD_COST = 10_000_00;

@Component({
	name: 'ConstructionWarehouseTile',
	components: { ConstructionTile, GameButton, MoneyLabel, LoadingIndicator },
})
export default class ConstructionWarehouseTile extends mixins(AwaitChangeMixin) {

	@InjectReactive()
	private readonly planet: Planet;

	@InjectReactive()
	private readonly warehouse: Warehouse | null;

	private readonly warehouseBuildCost: number = WAREHOUSE_BUILD_COST;

	private loading: boolean = false;

	private async buildWarehouse() {
		this.loading = true;

		if (this.warehouse == null) {
			let body = { planetId: this.planet.id };
			await request('post', 'warehouses', { body, json: true });
			await this.$change('warehouse', (warehouse) => warehouse != null);
		} else {
			let targetSize = this.warehouse.size + 1;
			let body = { size: targetSize };
			await request('patch', 'warehouses/' + this.warehouse.id, { body, json: true });
			await this.$change('warehouse', (warehouse) => warehouse.size === targetSize);
		}

		this.loading = false;
	}
}
</script>
