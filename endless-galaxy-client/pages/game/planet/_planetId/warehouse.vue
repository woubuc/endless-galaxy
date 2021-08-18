<template>
	<div class="px-6">
		<h2 class="mb-6 pb-1 text-lg font-semibold border-b-2 border-gray-700">{{ $t('warehouse.inventory') }}</h2>

		<div class="mb-6 flex flex-wrap gap-2">
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

@Component({
	name: 'WarehousePage',
	components: { DevInspect, InventoryStackTile },
})
export default class WarehousePage extends Vue {
	@InjectReactive()
	private readonly warehouse: Warehouse;
}
</script>
