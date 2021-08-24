<template>
	<div class="">
		<game-title>{{ $t(`factoryType.${ factory.factory_type }`) }}</game-title>
		<div v-if="factoryCurrentRecipe" class="flex px-3 mb-6">
			<div>
				<construction-tile-recipe :recipe-data="factoryCurrentRecipe" />
				<div v-if="factoryCurrentRecipe.hours > 1" class="flex items-center">
					<div class="flex-none mt-1 mr-4">{{ factory.hours_remaining }}h remaining</div>
					<div class="w-8 h-1 mt-1 bg-gray-900 rounded-full overflow-hidden">
						<div class="h-1 bg-violet-600" :style="{ width: `${ progress * 100 }%`}"></div>
					</div>
				</div>
			</div>
		</div>

		<div class="flex">
			<div>
				<game-title size="small">{{ $t('factory.change_recipe') }}</game-title>
				<loading-indicator v-if="loading" />
				<form v-else @submit.stop.prevent="setRecipe">
					<label
						v-for="recipe of factoryRecipes"
						:key="recipe.id"
						class="flex items-center my-0 odd:bg-gray-900 odd:bg-opacity-50 rounded px-4">

						<input type="radio" name="recipeDataId" :value="recipe.id" class="mr-6" required />
						<span class="flex-grow" />
						<span />
						<construction-tile-recipe :recipe-data="recipe" />
					</label>
					<input type="submit" :value="$t('factory.set_recipe')" />
				</form>
			</div>
		</div>

		<dev-inspect :data="factory" />
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, mixins, ProvideReactive, Vue } from 'nuxt-property-decorator';
import DevInspect from '~/components/DevInspect.vue';
import { Factory } from '~/models/Factory';
import GameTitle from '~/components/GameTitle.vue';
import ConstructionTileRecipe from '~/components/ConstructionTileRecipe.vue';
import FactoryTypeData, { FactoryTypeId } from '~/models/FactoryTypeData';
import RecipeData, { RecipeDataId } from '~/models/RecipeData';
import LoadingIndicator from '~/components/LoadingIndicator.vue';
import AwaitChangeMixin from '~/mixins/AwaitChangeMixin';
import { request } from '~/utils/request';

@Component({
	name: 'FactoryPage',
	components: { LoadingIndicator, ConstructionTileRecipe, GameTitle, DevInspect },
})
export default class FactoryPage extends mixins(AwaitChangeMixin) {

	@InjectReactive()
	private readonly planetFactories: Factory[];

	@InjectReactive()
	private readonly recipes: Record<RecipeDataId, RecipeData>;

	@InjectReactive()
	private readonly factoryTypes: Record<FactoryTypeId, FactoryTypeData>;

	private loading: boolean = false;

	private get factoryId(): number {
		return parseInt(this.$route.params.factoryId, 10);
	}

	private get factory(): Factory {
		return this.planetFactories.find(factory => factory.id === this.factoryId);
	}

	private get factoryType(): FactoryTypeData {
		return this.factoryTypes[this.factory.factory_type];
	}

	private get factoryRecipes(): RecipeData[] {
		return this.factoryType.recipes.map(id => this.recipes[id]);
	}

	private get factoryCurrentRecipe(): RecipeData | undefined {
		if (this.factory.recipe) {
			return this.recipes[this.factory.recipe];
		}
	}

	private get progress(): number {
		return 1 - (this.factory.hours_remaining / this.factoryCurrentRecipe.hours);
	}

	private async setRecipe(evt: Event): Promise<void> {
		this.loading = true;

		let body = new FormData(evt.target as HTMLFormElement);
		await request('patch', `factories/${ this.factoryId }`, { body });

		this.loading = false;
	}
}
</script>
