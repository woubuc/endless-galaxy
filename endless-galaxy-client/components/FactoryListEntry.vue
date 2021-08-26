<template>
	<div class="flex items-center -mx-2.5 px-2.5 py-2 space-x-4 odd:bg-gray-700 odd:bg-opacity-40 rounded">
		<nuxt-link
			:to="localePath({
				name: 'game-planet-planetId-factories-factoryId',
				params: { ...$route.params, factoryId: factory.id },
			})"
			class="block p-1 bg-gray-900 rounded">
			<img
				:src="`/buildings/${ factory.factory_type }.svg`"
				:alt="$t(`factoryType.${ factory.factory_type }`)"
				class="h-10" />
		</nuxt-link>
		<div>
			<p class="font-semibold">{{ $t(`factoryType.${ factory.factory_type }`) }}</p>
			<p v-if="factory.recipe === null" class="text-gray-500">{{ $t('building.idle') }}</p>
			<div v-else class="flex items-center">
				<div class="flex items-center mr-4 pl-0.5 pr-1.5 py-px bg-gray-900 bg-opacity-40 rounded">
					<item-icon v-for="id of Object.keys(outputItems)" :key="id" :item-type-id="id" class="-ml-1.5" />
				</div>
				<circle-progress v-if="factory.hours_remaining > 0" :progress="progress" class="mr-2" />
				<tick-offset-countdown :time="factory.hours_remaining" interval="hours" class="text-xs text-gray-300" />
			</div>
		</div>
		<span class="flex-grow" />
		<game-button size="small" to="game-planet-planetId-factories-factoryId" :factory-id="factory.id">View {{ $t(`factoryType.${ factory.factory_type }`) }}</game-button>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue } from 'nuxt-property-decorator';

import { Factory } from '~/models/Factory';
import { ItemTypeId } from '../models/ItemTypeData';
import RecipeData from '../models/RecipeData';
import CircleProgress from './CircleProgress.vue';
import ConstructionTileRecipe from './ConstructionTileRecipe.vue';

import GameButton from './GameButton.vue';
import ItemIcon from './ItemIcon.vue';
import TickOffsetCountdown from './TickOffsetCountdown.vue';

@Component({
	name: 'FactoryListEntry',
	components: { ItemIcon, TickOffsetCountdown, CircleProgress, ConstructionTileRecipe, GameButton },
})
export default class FactoryListEntry extends Vue {

	@Prop({ required: true })
	public readonly factory: Factory;

	@InjectReactive()
	private readonly recipes: Record<string, RecipeData>;

	@InjectReactive()
	private readonly tickOffsetMinutesSinceHour: number;

	private get recipe(): RecipeData | null {
		if(this.factory.recipe == null) {
			return null;
		}

		return this.recipes[this.factory.recipe];
	}

	private get outputItems(): Record<ItemTypeId, number> {
		return this.recipe?.output ?? {};
	}

	private get progress(): number {
		return 1
			- (this.factory.hours_remaining / this.recipe.hours)
			+ (this.tickOffsetMinutesSinceHour / (60 * this.recipe.hours));
	}
}
</script>
