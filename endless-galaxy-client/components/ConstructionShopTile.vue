<template>
	<div class="w-80 px-4 py-3 border-2 border-gray-700 rounded">
		<div class="flex items-stretch space-x-4">
			<div class="flex items-center justify-center h-20 w-20 bg-gray-900 rounded p-2">
				<img :src="`/shops/${ shopType.id }.svg`" :alt="$t(`shopType.${ shopType.id }`)" class="w-full" />
			</div>
			<div>
				<p class="text-white font-semibold">{{ $t(`shopType.${ shopType.id }`) }}</p>
				<p class="mb-0.5">
					<money-label :amount="shopType.price" class="text-gray-300" />
				</p>
				<game-button size="small">{{ $t('construction.build', ['']) }}</game-button>
			</div>
		</div>
		<div class="pt-3">
			<div class="flex items-center space-x-2 px-2 py-1.5 bg-gray-900 bg-opacity-50 rounded">
				<construction-tile-recipe-item v-for="id of shopType.items" :item-type-id="id" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue } from 'nuxt-property-decorator';
import FactoryTypeData from '../models/FactoryTypeData';
import RecipeData, { RecipeDataId } from '../models/RecipeData';
import ShopTypeData from '../models/ShopTypeData';
import ConstructionTileRecipe from './ConstructionTileRecipe.vue';
import ConstructionTileRecipeItem from './ConstructionTileRecipeItem.vue';
import GameButton from './GameButton.vue';
import MoneyLabel from './MoneyLabel.vue';

@Component({
	name: 'ConstructionShopTile',
	components: { ConstructionTileRecipeItem, ConstructionTileRecipe, GameButton, MoneyLabel },
})
export default class ConstructionShopTile extends Vue {

	@Prop({ required: true })
	public readonly shopType: ShopTypeData;
}
</script>
