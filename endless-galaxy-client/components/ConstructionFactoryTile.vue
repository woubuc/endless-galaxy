<template>
	<div class="w-80 px-4 py-3 border-2 border-gray-700 rounded">
		<div class="flex items-stretch space-x-4">
			<div class="flex items-center justify-center h-20 w-20 bg-gray-900 rounded p-2">
				<img :src="`/buildings/${ factoryType.id }.svg`" :alt="$t(`factoryType.${ factoryType.id }`)" class="w-full" />
			</div>
			<div>
				<p class="text-white font-semibold">{{ $t(`factoryType.${ factoryType.id }`) }}</p>
				<p class="mb-0.5">
					<money-label :amount="factoryType.price" class="text-gray-300" />
				</p>
				<game-button size="small">{{ $t('construction.build', ['']) }}</game-button>
			</div>
		</div>
		<div class="pt-3">
			<construction-tile-recipe v-for="recipe of factoryRecipes" :recipe-data="recipe" />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue } from 'nuxt-property-decorator';
import FactoryTypeData from '../models/FactoryTypeData';
import RecipeData, { RecipeDataId } from '../models/RecipeData';
import ConstructionTileRecipe from './ConstructionTileRecipe.vue';
import GameButton from './GameButton.vue';
import MoneyLabel from './MoneyLabel.vue';

@Component({
	name: 'ConstructionFactoryTile',
	components: { ConstructionTileRecipe, GameButton, MoneyLabel },
})
export default class ConstructionFactoryTile extends Vue {

	@Prop({ required: true })
	public readonly factoryType: FactoryTypeData;

	@InjectReactive()
	private readonly recipes: Record<RecipeDataId, RecipeData>;

	get factoryRecipes(): RecipeData[] {
		let recipes = [];
		for (let id of this.factoryType.recipes) {
			recipes.push(this.recipes[id]);
		}
		return recipes;
	}
}
</script>
