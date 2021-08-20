<template>
	<div class="flex items-center flex-none whitespace-nowrap text-sm">
		<span v-if="amount > 0" class="flex font-mono">
			<span v-if="amount < 100" class="text-gray-500">0</span>
			<span v-if="amount < 10" class="text-gray-500">0</span>
			{{ amount }}
		</span>

		<game-tooltip :text="$t(`itemType.${ itemTypeId }`)" class="inline">
			<img :src="`/items/${ itemTypeId }.svg`" :alt="$t(`itemType.${ itemTypeId }`)" class="ml-2 w-6" />
		</game-tooltip>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { ItemTypeId } from '../models/ItemTypeData';
import GameTooltip from './GameTooltip.vue';

@Component({
	name: 'ConstructionTileRecipeItem',
	components: { GameTooltip },
})
export default class ConstructionTileRecipeItem extends Vue {

	@Prop({ required: true })
	public readonly itemTypeId: ItemTypeId;

	@Prop({ default: 0 })
	public readonly amount: number;
}
</script>
