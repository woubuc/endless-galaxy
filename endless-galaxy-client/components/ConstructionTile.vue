<template>
	<div class="relative my-6 border-2 border-gray-700 rounded">
		<loading-indicator v-if="loading" class="absolute top-0 left-0 w-full h-full" />
		<div
			class="p-2 pr-3.5 flex items-center space-x-2.5"
			:class="loading ? 'opacity-20 pointer-events-none' : ''">

			<div class="flex-none flex items-center justify-center px-2 py-1 mr-2 bg-gray-700 rounded text-gray-300 text-xs font-mono">
				<img src="/warehouse.svg" :alt="$t('builing.warehouse')" class="h-10" />
<!--				<span>{{ level }}</span>-->
			</div>

			<div class="flex-grow pr-8">
				<p class="text-white font-semibold">
					{{ $t(`building.${ buildingId }`) }}
				</p>
				<div class="flex items-stretch space-x-4">
					<money-label :amount="cost" />
					<slot />
				</div>
			</div>

			<game-button
				v-if="canBuild"
				:type="loading ? 'disabled' : 'default'"
				@click="$emit('build')">
				{{ $t(`construction.${ level === 0 ? 'build' : 'upgrade' }`, [$t(`building.${ buildingId }`)]) }}
			</game-button>
			<game-button v-else type="disabled">
				{{ $t('construction.insufficient_money') }}
			</game-button>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue } from 'nuxt-property-decorator';
import User from '../models/User';
import GameButton from './GameButton.vue';
import LoadingIndicator from './LoadingIndicator.vue';
import MoneyLabel from './MoneyLabel.vue';

@Component({
	name: 'ConstructionTile',
	components: { GameButton, MoneyLabel, LoadingIndicator },
})
export default class ConstructionTile extends Vue {

	@Prop({ required: true })
	public readonly loading: boolean;

	@Prop({ required: true })
	public readonly buildingId: string;

	@Prop({ required: true })
	public readonly cost: number;

	@Prop({ required: true })
	public readonly level: number;

	@InjectReactive()
	private readonly user: User;

	private get canBuild(): boolean {
		return this.user.money >= this.cost;
	}
}
</script>
