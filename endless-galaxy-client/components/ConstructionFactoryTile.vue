<template>
	<div class="w-80 px-4 py-3 border-2 border-gray-700 rounded">
		<loading-indicator v-if="loading" class="h-full" />

		<div v-else class="flex items-stretch space-x-4">
			<div class="flex items-center justify-center h-20 w-20 bg-gray-900 rounded p-2">
				<img :src="`/buildings/${ factoryType.id }.svg`" :alt="$t(`factoryType.${ factoryType.id }`)"
					 class="w-full" />
			</div>
			<div>
				<p class="text-white font-semibold">{{ $t(`factoryType.${ factoryType.id }`) }}</p>
				<p class="mb-0.5">
					<money-label :amount="factoryType.price" class="text-gray-300" />
				</p>
				<game-button size="small" @click="build">{{ $t('construction.build', ['']) }}</game-button>
				<game-button size="small" type="subtle" @click="showRecipes">View Recipes</game-button>
			</div>
		</div>

		<game-modal
			ref="recipes"
			:title="$t('construction.recipes_title', [$t(`factoryType.${ factoryType.id }`)])">
			<p class="flex justify-between -mt-1 mb-1 text-xs uppercase font-medium text-gray-400">
				<span>{{ $t('factory.input') }}</span>
				<span>{{ $t('factory.output') }}</span>
			</p>
			<construction-tile-recipe
				v-for="recipe of factoryRecipes"
				:key="recipe.id"
				:recipe-data="recipe" />
		</game-modal>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, mixins, Prop } from 'nuxt-property-decorator';

import TypedRefMixin from '~/mixins/TypedRefMixin';
import FactoryTypeData from '~/models/FactoryTypeData';
import RecipeData, { RecipeDataId } from '~/models/RecipeData';
import Planet from '~/models/Planet';
import { request } from '~/utils/request';
import AwaitChangeMixin from '../mixins/AwaitChangeMixin';
import { Factory } from '../models/Factory';

import ConstructionTileRecipe from './ConstructionTileRecipe.vue';
import GameButton from './GameButton.vue';
import GameModal from './GameModal.vue';
import GameTitle from './GameTitle.vue';
import LoadingIndicator from './LoadingIndicator.vue';
import MoneyLabel from './MoneyLabel.vue';

@Component({
	name: 'ConstructionFactoryTile',
	components: { LoadingIndicator, GameTitle, GameModal, ConstructionTileRecipe, GameButton, MoneyLabel },
})
export default class ConstructionFactoryTile extends mixins(TypedRefMixin, AwaitChangeMixin) {

	@Prop({ required: true })
	public readonly factoryType: FactoryTypeData;

	@InjectReactive()
	private readonly recipes: Record<RecipeDataId, RecipeData>;

	@InjectReactive()
	private readonly planet: Planet;

	@InjectReactive()
	private readonly factories: Factory[];

	private loading: boolean = false;

	private get factoryRecipes(): RecipeData[] {
		let recipes: RecipeData[] = [];
		for (let id of this.factoryType.recipes) {
			recipes.push(this.recipes[id]);
		}
		return recipes
			.map(recipeData => ({
				inputCount: Object.keys(recipeData.input).length,
				outputCount: Object.keys(recipeData.output).length,
				...recipeData,
			}))
			.sort((a, b) => {
				let inputCountDiff = a.inputCount - b.inputCount;
				if (inputCountDiff !== 0) {
					return inputCountDiff;
				}
				return a.hours - b.hours;
			});
	}

	private showRecipes(): void {
		this.$ref<GameModal>('recipes').show();
	}

	private async build(): Promise<void> {
		this.loading = true;

		let body = JSON.stringify({
			planetId: this.planet.id,
			factoryTypeId: this.factoryType.id,
		});
		let { id } = await request('post', 'factories', { body, json: true });
		await this.$change('factories', (factories: Factory[]) => factories.some(f => f.id === id));
		await this.$router.push(this.localePath({
			name: 'game-planet-planetId-factories-factoryId',
			params: {
				planetId: this.planet.id.toString(),
				factoryId: id.toString(),
			},
		}));
	}
}
</script>
