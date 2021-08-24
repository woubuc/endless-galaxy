<template>
	<game-container class="my-6">
		<loading-indicator v-if="loading" />

		<div v-else-if="isTraveling">
			<game-title>Traveling</game-title>
			<p>Going to <nuxt-link :to="localePath({ name: 'game-planet-planetId', params: { planetId: ship.planet_id }})">{{ planetName }}</nuxt-link></p>
			<p class="text-gray-300">Arrives in {{ ship.movement_minutes_remaining }} minutes</p>

			<game-title>Inventory</game-title>
			<div class="flex flex-wrap gap-2">
				<inventory-stack-tile
					v-for="[itemType, stack] of Object.entries(ship.inventory)"
					:key="itemType"
					:item-type="itemType"
					:stack="stack" />
			</div>
		</div>

		<div v-else>
			<game-title>Ship</game-title>
			<p>At <nuxt-link :to="localePath({ name: 'game-planet-planetId', params: { planetId: ship.planet_id }})">{{ planetName }}</nuxt-link></p>

			<game-title size="small">Travel</game-title>
			<div class="flex">
				<form @submit.stop.prevent="travel">
					<label>
						<span>Travel to</span>
						<select name="planetId">
							<option v-for="planet of planets" :key="planet.id" v-if="planet.id !== ship.planet_id" :value="planet.id">{{ planet.name }}</option>
						</select>
					</label>
					<input type="submit" value="Go">
				</form>
			</div>

			<game-title>Inventory</game-title>
			<div class="flex space-x-6">
				<div class="flex-1">
					<game-title size="small">Ship</game-title>
					<div class="flex flex-wrap gap-2">
						<inventory-stack-tile
							v-for="[itemType, stack] of Object.entries(ship.inventory)"
							:key="itemType"
							:item-type="itemType"
							:stack="stack"
							:transfer="true"
							@transfer="transfer('warehouse', itemType, $event)" />
					</div>
				</div>
				<div class="flex-1">
					<game-title size="small">Planet warehouse</game-title>
					<p v-if="!warehouse" class="text-gray-400 text-center">
						No warehouse on this planet
					</p>
					<div v-else class="flex flex-wrap gap-2">
						<inventory-stack-tile
							v-for="[itemType, stack] of Object.entries(warehouse.inventory)"
							:key="itemType"
							:item-type="itemType"
							:stack="stack"
							:transfer="true"
							@transfer="transfer('ship', itemType, $event)" />
					</div>
				</div>
			</div>
		</div>

		<dev-inspect :data="ship" title="ship" />
	</game-container>
</template>

<script lang="ts">
import { Component, InjectReactive, mixins, ProvideReactive, Vue } from 'nuxt-property-decorator';
import DevInspect from '../../../components/DevInspect.vue';
import GameContainer from '../../../components/GameContainer.vue';
import GameTitle from '../../../components/GameTitle.vue';
import InventoryStackTile from '../../../components/InventoryStackTile.vue';
import LoadingIndicator from '../../../components/LoadingIndicator.vue';
import AwaitChangeMixin from '../../../mixins/AwaitChangeMixin';
import { ItemTypeId } from '../../../models/ItemTypeData';
import Planet from '../../../models/Planet';
import Ship from '../../../models/Ship';
import Warehouse from '../../../models/Warehouse';
import { request } from '../../../utils/request';

@Component({
	name: 'ShipContainerPage',
	components: { LoadingIndicator, InventoryStackTile, DevInspect, GameTitle, GameContainer },
})
export default class ShipContainerPage extends mixins(AwaitChangeMixin) {

	@InjectReactive()
	private readonly planets: Planet[];

	@InjectReactive()
	private readonly ships: Ship[];

	@InjectReactive()
	private readonly warehouses: Warehouse[];

	private loading: boolean = false;

	public get ship(): Ship {
		return this.ships.find(s => s.id === this.shipId);
	}

	public get warehouse(): Warehouse | null {
		return this.warehouses.find(w => w.planet_id === this.ship.planet_id) ?? null;
	}

	private get shipId(): number {
		return parseInt(this.$route.params.shipId, 10);
	}

	private get isTraveling(): boolean {
		return this.ship.movement_minutes_remaining != null;
	}

	private get planetName(): string {
		return this.planets.find(p => p.id === this.ship.planet_id).name;
	}

	private async travel(evt: Event): Promise<void> {
		this.loading = true;

		let body = new FormData(evt.target as HTMLFormElement);
		await request('post', `ships/${ this.shipId }/travel`, { body });
		await this.$change('ship', (ship: Ship) => ship.movement_minutes_remaining > 0);
		this.loading = false;
	}

	private async transfer(to: 'ship' | 'warehouse', itemTypeId: ItemTypeId, amount: number) {
		let body = JSON.stringify({ to, itemTypeId, amount });
		await request('post', `ships/${ this.shipId }/transfer`, { body, json: true });
	}
}
</script>
