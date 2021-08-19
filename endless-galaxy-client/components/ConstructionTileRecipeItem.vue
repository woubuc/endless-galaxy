<template>
	<game-tooltip :text="$t(`itemType.${ itemTypeId }`)" class="flex items-center space-x-1 flex-none whitespace-nowrap text-xs">
		<span v-if="amount > 0" class="font-mono">
			<span v-if="amount < 10" class="text-gray-500">0</span>{{ amount }}
		</span>
		<img :src="`/items/${ itemTypeId }.svg`" :alt="$t(`itemType.${ itemTypeId }`)" class="inline w-6" />
	</game-tooltip>
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
