<template>
	<div class="flex items-center flex-none whitespace-nowrap text-sm">
		<span v-if="amount > 0" class="flex font-mono">
			<span v-if="amount < 100" class="text-gray-500">0</span>
			<span v-if="amount < 10" class="text-gray-500">0</span>
			{{ amount }}
		</span>

		<div class="relative">
			<item-icon :item-type-id="itemTypeId" />
			<icon-double-up
				v-if="modifier !== 1"
				class="absolute -top-px -right-px h-2.5 p-px rounded-full bg-gray-800 pointer-events-none"
				:class="modifier > 1 ? 'text-amber-400' : 'text-rose-400 transform rotate-180'" />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { ItemTypeId } from '../models/ItemTypeData';
import GameTooltip from './GameTooltip.vue';
import ItemIcon from './ItemIcon.vue';

import IconDoubleUp from '~/assets/icons/double-up.svg?inline';

@Component({
	name: 'ConstructionTileRecipeItem',
	components: { ItemIcon, GameTooltip, IconDoubleUp },
})
export default class ConstructionTileRecipeItem extends Vue {

	@Prop({ required: true })
	public readonly itemTypeId: ItemTypeId;

	@Prop({ default: 0 })
	public readonly amount: number;

	@Prop({ default: 1 })
	public readonly modifier: number;
}
</script>
