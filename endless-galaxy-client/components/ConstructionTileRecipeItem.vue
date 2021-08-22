<template>
	<div class="flex items-center flex-none whitespace-nowrap text-sm">
		<span v-if="amount > 0" class="flex font-mono">
			<span v-if="amount < 100" class="text-gray-500">0</span>
			<span v-if="amount < 10" class="text-gray-500">0</span>
			{{ amount }}
		</span>

		<item-icon :item-type-id="itemTypeId" />
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { ItemTypeId } from '../models/ItemTypeData';
import GameTooltip from './GameTooltip.vue';
import ItemIcon from './ItemIcon.vue';

@Component({
	name: 'ConstructionTileRecipeItem',
	components: { ItemIcon, GameTooltip },
})
export default class ConstructionTileRecipeItem extends Vue {

	@Prop({ required: true })
	public readonly itemTypeId: ItemTypeId;

	@Prop({ default: 0 })
	public readonly amount: number;
}
</script>
