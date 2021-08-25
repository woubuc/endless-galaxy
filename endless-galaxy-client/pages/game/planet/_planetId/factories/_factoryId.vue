<template>
	<div class="">
		<game-title>{{ $t(`factoryType.${ factory.factory_type }`) }}</game-title>
		<loading-indicator v-if="loading" />
		<div v-else-if="factoryCurrentRecipe" class="flex px-3 mb-6">
			<div>
				<construction-tile-recipe :recipe-data="factoryCurrentRecipe" />
				<div v-if="!hasSupply" class="py-1 text-rose-300 text-sm text-center">
					{{ $t('factory.no_supply') }}
				</div>
				<div v-else-if="factoryCurrentRecipe.hours > 1" class="flex items-center mt-1 text-sm text-gray-300">
					<circle-progress :progress="progress" />
					<span class="flex-grow" />
					<div class="flex-none ml-4 text-right">
						{{ $tc('factory.recipe_hours_remaining', factory.hours_remaining, [factory.hours_remaining]) }}
					</div>
				</div>
			</div>
			<div class="space-y-2 ml-16 px-5 py-3 border-2 border-gray-700 rounded">
				<loading-indicator v-if="loadingRepeating" />
				<template v-else>
					<p v-if="factory.repeat">{{ $t('factory.repeating') }}</p>
					<p v-else>{{ $t('factory.not_repeating') }}</p>

					<game-button v-if="factory.repeat" size="small" @click="setRepeating(false)">Stop production after
						this
					</game-button>
					<game-button v-else size="small" @click="setRepeating(true)">Keep producing</game-button>
				</template>
			</div>
		</div>
		<div v-else class="py-6 space-y-2 text-center">
			<p class="text-gray-300">{{ $t('factory.idle', [$t(`factoryType.${ factory.factory_type }`)]) }}</p>
			<game-button @click="selectRecipe">{{ $t('factory.change_recipe') }}</game-button>
		</div>

		<game-modal
			ref="changeRecipe"
			:title="$t('factory.change_recipe')"
			:confirm="$t('factory.set_recipe')"
			@submit="setRecipe">
			<form @submit.stop.prevent="setRecipe">
				<label
					v-for="recipe of factoryRecipes"
					:key="recipe.id"
					class="flex items-center my-0 odd:bg-gray-900 odd:bg-opacity-50 rounded px-4">

					<input type="radio" name="recipeDataId" v-model="selectedRecipe" :value="recipe.id" class="mr-6" />
					<span class="flex-grow" />
					<span />
					<construction-tile-recipe :recipe-data="recipe" />
				</label>
			</form>
		</game-modal>

		<dev-inspect :data="factory" />
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, mixins } from 'nuxt-property-decorator';
import ConstructionTileRecipe from '~/components/ConstructionTileRecipe.vue';
import DevInspect from '~/components/DevInspect.vue';
import GameTitle from '~/components/GameTitle.vue';
import LoadingIndicator from '~/components/LoadingIndicator.vue';
import AwaitChangeMixin from '~/mixins/AwaitChangeMixin';
import { Factory } from '~/models/Factory';
import FactoryTypeData, { FactoryTypeId } from '~/models/FactoryTypeData';
import RecipeData, { RecipeDataId } from '~/models/RecipeData';
import { request } from '~/utils/request';
import CircleProgress from '~/components/CircleProgress.vue';
import GameButton from '~/components/GameButton.vue';
import GameModal from '~/components/GameModal.vue';
import TypedRefMixin from '~/mixins/TypedRefMixin';
import Warehouse from '~/models/Warehouse';
import { contains } from '../../../../../utils/inventory';

@Component({
	name: 'FactoryPage',
	components: {
		CircleProgress,
		GameButton,
		GameModal,
		LoadingIndicator,
		ConstructionTileRecipe,
		GameTitle,
		DevInspect,
	},
})
export default class FactoryPage extends mixins(AwaitChangeMixin, TypedRefMixin) {

	@InjectReactive()
	private readonly planetFactories: Factory[];

	@InjectReactive()
	private readonly recipes: Record<RecipeDataId, RecipeData>;

	@InjectReactive()
	private readonly factoryTypes: Record<FactoryTypeId, FactoryTypeData>;

	@InjectReactive()
	private readonly warehouse: Warehouse;

	private loading: boolean = false;
	private loadingRepeating: boolean = false;
	private selectedRecipe: string = '';

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

	private get hasSupply(): boolean {
		return contains(this.warehouse.inventory, this.factoryCurrentRecipe.input);
	}

	private get progress(): number {
		return 1 - (this.factory.hours_remaining / this.factoryCurrentRecipe.hours);
	}

	private async setRepeating(repeat: boolean) {
		this.loadingRepeating = true;

		let body = { repeat };
		await request('patch', `factories/${ this.factoryId }`, { body, json: true });

		this.loadingRepeating = false;
	}

	private selectRecipe(): void {
		this.$ref<GameModal>('changeRecipe').show();
	}

	private async setRecipe(): Promise<void> {
		this.loading = true;

		let body = { recipeDataId: this.selectedRecipe };
		await request('patch', `factories/${ this.factoryId }`, { body, json: true });

		this.loading = false;
	}
}
</script>
