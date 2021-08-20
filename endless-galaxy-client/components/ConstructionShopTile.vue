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
				<game-button size="small" type="subtle" @click="showItems">{{ $t('construction.items_button') }}</game-button>
			</div>
		</div>

		<game-modal ref="items" :title="$t('construction.items_title', [$t(`shopType.${ shopType.id }`)])">
			<div class="flex flex-wrap items-center space-x-2 px-2 py-1.5 bg-gray-900 bg-opacity-50 rounded">
				<construction-tile-recipe-item v-for="id of shopType.items" :item-type-id="id" />
			</div>
		</game-modal>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, mixins, Prop, Vue } from 'nuxt-property-decorator';
import TypedRefMixin from '../mixins/TypedRefMixin';
import FactoryTypeData from '../models/FactoryTypeData';
import RecipeData, { RecipeDataId } from '../models/RecipeData';
import ShopTypeData from '../models/ShopTypeData';
import ConstructionTileRecipe from './ConstructionTileRecipe.vue';
import ConstructionTileRecipeItem from './ConstructionTileRecipeItem.vue';
import GameButton from './GameButton.vue';
import GameModal from './GameModal.vue';
import MoneyLabel from './MoneyLabel.vue';

@Component({
	name: 'ConstructionShopTile',
	components: { GameModal, ConstructionTileRecipeItem, ConstructionTileRecipe, GameButton, MoneyLabel },
})
export default class ConstructionShopTile extends mixins(TypedRefMixin) {

	@Prop({ required: true })
	public readonly shopType: ShopTypeData;

	private showItems(): void {
		this.$ref<GameModal>('items').show();
	}
}
</script>
