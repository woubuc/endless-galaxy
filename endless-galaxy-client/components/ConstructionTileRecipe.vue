<template>
	<div class="px-4 -mx-4 py-2.5 odd:bg-gray-900 odd:bg-opacity-75 rounded">
		<div class="flex items-center">
			<div v-if="inputs.length > 0" class="flex-grow flex items-center space-x-3 mr-6">
				<construction-tile-recipe-item v-for="[id, amount] of inputs" :key="id" :item-type-id="id" :amount="amount" />
			</div>
			<span v-else class="flex-grow" />

			<div v-if="outputs.length > 0" class="relative flex items-center justify-center h-8 mr-6 -my-1">
				<icon-delivery-time class="absolute z-0 h-7 text-gray-500 opacity-50" />
				<p class="relative z-10 px-2 py-px text-xs font-mono">{{ time }}</p>
			</div>

			<div class="flex items-center space-x-3">
				<construction-tile-recipe-item v-for="[id, amount] of outputs" :key="id" :item-type-id="id" :amount="amount" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import RecipeData, { RecipeDataId } from '~/models/RecipeData';

import ConstructionTileRecipeItem from './ConstructionTileRecipeItem.vue';

import IconDeliveryTime from '~/assets/icons/delivery-time.svg?inline';

@Component({
	name: 'ConstructionTileRecipe',
	components: { ConstructionTileRecipeItem, IconDeliveryTime },
})
export default class ConstructionTileRecipe extends Vue {

	@Prop({ required: true })
	public readonly recipeData: RecipeData;

	private get inputs(): [RecipeDataId, number][] {
		return Array.from(Object.entries(this.recipeData.input));
	}

	private get outputs(): [RecipeDataId, number][] {
		return Array.from(Object.entries(this.recipeData.output));
	}

	private get time(): string {
		let hours = this.recipeData.hours;
		if (hours < 24) {
			return `${ hours }h`;
		}

		return `${ Math.round(hours / 24 ) }d`;
	}
}
</script>
