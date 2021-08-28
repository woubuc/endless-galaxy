<template>
	<div>
		<game-title>{{ $t('planet.ships') }}</game-title>
		<p v-if="shipsHere.length === 0" class="py-2 text-gray-400 italic">No ships here</p>
		<div v-else class="flex flex-wrap gap-2">
			<ship-button v-for="ship of shipsHere" :key="ship.id" :ship="ship" />
		</div>

		<template v-if="shipsEnRoute.length > 0">
			<game-title size="small">En route</game-title>
			<div class="flex flex-wrap gap-2">
				<ship-button v-for="ship of shipsEnRoute" :key="ship.id" :ship="ship" />
			</div>
		</template>

		<game-title>Nature</game-title>
		<loading-indicator v-if="scavenging" />
		<template v-else>
			<p class="mb-2">Search the surface of the planet for items</p>
			<div class="flex items-center">
				<game-button v-if="hasWarehouse && canAffordScavenge" size="small" @click="scavenge">Scavenge</game-button>
				<game-button v-else-if="!canAffordScavenge" size="small" type="disabled">Can't afford</game-button>
				<game-button v-else size="small" type="disabled">No warehouse</game-button>
				<money-label class="ml-2" :amount="planetScavengeCost" />
			</div>
			<div v-if="scavengingResult"
				 class="flex items-center space-x-4 my-2 px-2.5 py-1 border-2 border-gray-700 rounded">
				<p class="pb-1">Found</p>
				<construction-tile-recipe-item v-for="[id, stack] of Object.entries(scavengingResult)" :key="id"
											   :item-type-id="id" :amount="stack.amount" />
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';

import GameTitle from '~/components/GameTitle.vue';
import ShipButton from '~/components/ShipButton.vue';

import Ship from '~/models/Ship';
import ConstructionTileRecipeItem from '~/components/ConstructionTileRecipeItem.vue';
import GameButton from '~/components/GameButton.vue';
import LoadingIndicator from '~/components/LoadingIndicator.vue';
import MoneyLabel from '~/components/MoneyLabel.vue';
import { Inventory } from '~/models/Inventory';
import { request } from '~/utils/request';
import User from '../../../../models/User';

@Component({
	name: 'PlanetShipsPage',
	components: { ConstructionTileRecipeItem, MoneyLabel, GameButton, LoadingIndicator, GameTitle, ShipButton },
})
export default class PlanetShipsPage extends Vue {
	@InjectReactive()
	private readonly planetId: number;

	@InjectReactive()
	private readonly planetShips: Ship[];

	@InjectReactive()
	private readonly planetScavengeCost: number;

	@InjectReactive()
	private readonly hasWarehouse: boolean;

	@InjectReactive()
	private readonly user: User;

	private scavenging: boolean = false;
	private scavengingResult: Inventory | null = null;

	private get canAffordScavenge(): boolean {
		return this.user.money >= this.planetScavengeCost;
	}

	private get shipsHere(): Ship[] {
		return this.planetShips.filter(s => s.movement_minutes == null).sort((a, b) => a.id - b.id);
	}

	private get shipsEnRoute(): Ship[] {
		return this.planetShips.filter(s => s.movement_minutes != null).sort((a, b) => a.id - b.id);
	}

	private async scavenge(): Promise<void> {
		this.scavenging = true;
		this.scavengingResult = await request('post', `planets/${ this.planetId }/scavenge`);
		this.scavenging = false;
	}
}
</script>
