<template>
	<div class="">
		<game-title>{{ $t(`factoryType.${ factory.factory_type }`) }}</game-title>
		<loading-indicator v-if="loading" />
		<div v-else-if="factoryCurrentRecipe" class="flex px-3 mb-6">
			<div>
				<construction-tile-recipe :recipe-data="factoryCurrentRecipe" :multiplier="factory.size" />
				<div v-if="factory.hours_remaining !== 0 || hasSupply"
					 class="flex items-center mt-1 text-sm text-gray-300">
					<circle-progress :progress="progress" />
					<span class="flex-grow" />
					<div class="flex-none ml-6 text-right">
						<template v-if="factory.hours_remaining === 0">
							<span class="text-gray-400">{{ $t('factory.pending') }}</span>
							<tick-offset-countdown :time="1" interval="hours" />
						</template>
						<tick-offset-countdown v-else :time="factory.hours_remaining" interval="hours" />
					</div>
				</div>
				<div v-else-if="!hasSupply" class="py-1 text-rose-300 text-sm text-center">
					{{ $t('factory.no_supply') }}
				</div>
			</div>
			<div class="space-y-2 ml-16 px-5 py-3 border-2 border-gray-700 rounded">
				<loading-indicator v-if="loadingRepeating" />
				<template v-else>
					<p v-if="factory.repeat">{{ $t('factory.repeating') }}</p>
					<p v-else>{{ $t('factory.not_repeating') }}</p>

					<div class="flex items-start space-x-2">
						<game-button v-if="factory.repeat" size="small" @click="setRepeating(false)">
							Stop production <span v-if="factory.hours_remaining > 0">after this run</span>
						</game-button>
						<game-button v-else size="small" @click="setRepeating(true)">Keep producing</game-button>
						<div v-if="factory.hours_remaining > 0" class="px-2 py-1 text-sm text-gray-400 italic">or</div>
						<div v-if="factory.hours_remaining > 0">
							<game-button size="small" @click="clearRecipe">
								Cancel production immediately
							</game-button>
							<p class="text-sm text-gray-300 italic">All resources from this run will be lost</p>
						</div>
					</div>
				</template>
			</div>
		</div>
		<template v-else>
			<div class="py-6 space-y-2 text-center">
				<p class="text-gray-300">{{ $t('factory.idle', [$t(`factoryType.${ factory.factory_type }`)]) }}</p>
				<game-button @click="selectRecipe">{{ $t('factory.change_recipe') }}</game-button>
			</div>

			<game-title size="small">Operations</game-title>
			<div class="flex space-x-8">
				<div class="space-y-1">
					<p class="mb-2 pb-2 pr-1 border-b-2 border-gray-700">
						<span class="px-2 py-1 bg-gray-900 bg-opacity-60 rounded font-mono font-semibold">{{
								factory.size
							}}</span>
						<span class="text-gray-300">building level</span>
					</p>

					<p>
						<span
							class="text-sm px-2 py-1 bg-gray-900 bg-opacity-60 rounded text-gray-100 font-mono font-semibold">{{
								factory.size
							}}<span class="font-light text-gray-300">x</span></span>
						<span class="text-sm text-gray-400">production</span>
					</p>
					<p>
						<span
							class="text-sm px-2 py-1 bg-gray-900 bg-opacity-60 rounded text-gray-100 font-mono font-semibold">{{
								factory.staff
							}}</span>
						<span class="text-sm text-gray-400">employees</span>
					</p>
					<p>
						<money-label
							class="text-sm px-2 py-1 bg-gray-900 bg-opacity-60 rounded text-gray-100 font-semibold"
							:amount="factory.staff * staffWages" />
						<span class="text-sm text-gray-400">hourly wages</span>
					</p>
				</div>
				<div class="px-4 py-3 border-2 border-gray-700 rounded">
					<p>
						<game-button @click="upgrade">Upgrade factory</game-button>
					</p>
					<p class="pt-1 pb-2">
						<money-label :amount="factoryType.price" />
					</p>
					<p class="text-sm">
						<span class="font-mono">+1</span>
						<span class="text-gray-400">employee</span>
					</p>
					<p class="text-sm">
						<span class="font-mono">+1</span>
						<span class="text-gray-400">production</span>
					</p>
				</div>
			</div>

			<game-title size="small">Construction</game-title>
			<div class="flex items-center space-x-4">
				<game-button @click="deleteFactory" size="small">Destroy factory</game-button>
				<p class="text-sm italic font-medium">You will not get any resources back</p>
			</div>
		</template>

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
					<construction-tile-recipe :recipe-data="recipe" :multiplier="factory.size" />
				</label>
			</form>
		</game-modal>

		<dev-inspect :data="factory" />
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, mixins } from 'nuxt-property-decorator';
import CircleProgress from '~/components/CircleProgress.vue';
import ConstructionTileRecipe from '~/components/ConstructionTileRecipe.vue';
import DevInspect from '~/components/DevInspect.vue';
import GameButton from '~/components/GameButton.vue';
import GameModal from '~/components/GameModal.vue';
import GameTitle from '~/components/GameTitle.vue';
import LoadingIndicator from '~/components/LoadingIndicator.vue';
import MoneyLabel from '~/components/MoneyLabel.vue';
import TickOffsetCountdown from '~/components/TickOffsetCountdown.vue';
import AwaitChangeMixin from '~/mixins/AwaitChangeMixin';
import TypedRefMixin from '~/mixins/TypedRefMixin';
import { Factory } from '~/models/Factory';
import FactoryTypeData, { FactoryTypeId } from '~/models/FactoryTypeData';
import RecipeData, { RecipeDataId } from '~/models/RecipeData';
import Warehouse from '~/models/Warehouse';
import { contains } from '~/utils/inventory';
import { request } from '~/utils/request';

@Component({
	name: 'FactoryPage',
	components: {
		MoneyLabel,
		TickOffsetCountdown,
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
	private readonly tickOffsetMinutesSinceHour: number;

	@InjectReactive()
	private readonly warehouse: Warehouse;

	@InjectReactive()
	private factoryId: number;

	@InjectReactive()
	private factory: Factory;

	@InjectReactive()
	private staffWages: number;

	private loading: boolean = false;
	private loadingRepeating: boolean = false;
	private selectedRecipe: string = '';

	private get factoryType(): FactoryTypeData {
		return this.factoryTypes[this.factory.factory_type];
	}

	private get factoryRecipes(): RecipeData[] {
		return this.factoryType.recipes.map(id => this.recipes[id]);
	}

	private get factoryCurrentRecipe(): RecipeData | undefined {
		if (this.factory?.recipe) {
			return this.recipes[this.factory.recipe];
		}
	}

	private get hasSupply(): boolean {
		return contains(this.warehouse.inventory, this.factoryCurrentRecipe.input);
	}

	private get progress(): number {
		return 1
			- (this.factory.hours_remaining / this.factoryCurrentRecipe.hours)
			+ (this.tickOffsetMinutesSinceHour / (60 * this.factoryCurrentRecipe.hours));
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

	private async clearRecipe(): Promise<void> {
		this.loadingRepeating = true;
		let body = { recipeDataId: '$clear' };
		await request('patch', `factories/${ this.factoryId }`, { body, json: true });
		this.loadingRepeating = false;
	}

	private async upgrade(): Promise<void> {
		this.loading = true;
		let body = { size: this.factory.size + 1 };
		await request('patch', `factories/${ this.factoryId }`, { body, json: true });
		this.loading = false;
	}

	private async deleteFactory(): Promise<void> {
		this.loading = true;
		await request('delete', `factories/${ this.factoryId }`);
	}
}
</script>
