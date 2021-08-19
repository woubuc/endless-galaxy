<template>
	<div class="flex flex-wrap gap-2 p-0.5 -m-0.5">
		<div v-for="[itemType, stack] of Object.entries(inventory)" :key="itemType" class="relative">
			<div v-if="value === itemType"
				 class="absolute -top-0.5 -left-0.5 w-5 h-5 p-1 rounded-full bg-violet-500 text-white">
				<icon-checked class="h-3" />
			</div>
			<inventory-stack-tile
				:item-type="itemType"
				:stack="stack"
				class="cursor-pointer hover:bg-violet-600"
				:class="value === itemType ? 'bg-gray-700 hover:bg-gray-700' : ''"
				@click.native="$emit('input', itemType)" />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
import { Inventory } from '../models/Inventory';

import IconChecked from '~/assets/icons/checked.svg?inline';
import InventoryStackTile from './InventoryStackTile.vue';

@Component({
	name: 'InventoryItemSelector',
	components: { InventoryStackTile, IconChecked },
})
export default class InventoryItemSelector extends Vue {

	@Prop({ required: true })
	public readonly inventory: Inventory;

	@Prop({ default: '' })
	public readonly value: string;

}
</script>
