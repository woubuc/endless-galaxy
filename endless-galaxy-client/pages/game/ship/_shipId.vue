<template>
	<game-container class="my-6">
		<loading-indicator v-if="loading" />

		<template v-else>
			<game-title>Ship</game-title>
			<div class="inline-flex items-center space-x-2 mb-1.5 p-2 pr-3 border-2 border-gray-700 rounded">
				<div class="p-1.5 bg-gray-900 rounded text-gray-200">
					<component :is="ship.ship_type === 'scout' ? require('~/assets/icons/space-shuttle.svg?inline') : require('~/assets/icons/shipping-container.svg?inline')" class="h-6" />
				</div>
				<div>
					<p class="font-semibold">{{ $t(`shipType.${ ship.ship_type }`) }}</p>
					<p class="text-sm text-gray-300 leading-3">
						<money-label class="text-xs" :amount="shipType.runCost" /> / day
					</p>
				</div>
			</div>

			<div v-if="isTraveling">
				<p>Going to
					<nuxt-link :to="localePath({ name: 'game-planet-planetId', params: { planetId: ship.planet_id }})">
						{{ planetName }}
					</nuxt-link>
				</p>
				<p class="text-gray-300">Arrives in
					<tick-offset-countdown :time="ship.movement_minutes_remaining" />
				</p>

				<game-title>Inventory</game-title>
				<div class="flex-grow -mt-2 mb-4">
					<div class="h-3 bg-gray-900 bg-opacity-50 rounded overflow-hidden">
						<div
							class="h-3 bg-gradient-to-b from-violet-700 to-violet-900"
							:style="{ width: `${ shipFilledPercentage * 100 }%` }" />
					</div>
					<p class="flex-none font-mono text-sm text-gray-200">{{ shipFilled }}/{{ shipType.capacity }}m³</p>
				</div>
				<div class="flex flex-wrap gap-2">
					<inventory-stack-tile
						v-for="[itemType, stack] of Object.entries(ship.inventory)"
						:key="itemType"
						:item-type="itemType"
						:stack="stack" />
				</div>
			</div>

			<div v-else>
				<p>At
					<nuxt-link :to="localePath({ name: 'game-planet-planetId', params: { planetId: ship.planet_id }})">
						{{ planetName }}
					</nuxt-link>
				</p>

				<game-title size="small">Travel to</game-title>
				<div
					v-for="[planet, minutes] of travelDestinations"
					:key="planet.id"
					class="flex items-center space-x-2 mt-0 py-1.5">
					<game-button size="small" @click="travelTo(planet.id)">{{ planet.name }}</game-button>
					<span class="text-sm text-gray-300">{{ minutes }} minutes</span>
				</div>

				<game-title>Inventory</game-title>
				<div class="flex space-x-6">
					<div class="flex-1">
						<game-title size="small">Ship</game-title>
						<div class="flex-grow -mt-2 mb-4">
							<div class="h-3 bg-gray-900 bg-opacity-50 rounded overflow-hidden">
								<div
									class="h-3 bg-gradient-to-b from-violet-700 to-violet-900"
									:style="{ width: `${ shipFilledPercentage * 100 }%` }" />
							</div>
							<p class="flex-none font-mono text-sm text-gray-200">{{ shipFilled }}/{{ shipType.capacity }}m³</p>
						</div>
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
						<div v-else>
							<div class="flex-grow -mt-2 mb-4">
								<div class="h-3 bg-gray-900 bg-opacity-50 rounded overflow-hidden">
									<div
										class="h-3 bg-gradient-to-b from-violet-700 to-violet-900"
										:style="{ width: `${ warehouseFilledPercentage * 100 }%` }" />
								</div>
								<p class="flex-none font-mono text-sm text-gray-200">{{ warehouseFilled }}/{{ warehouse.capacity }}m³</p>
							</div>
							<div class="flex flex-wrap gap-2">
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
			</div>
		</template>

		<dev-inspect :data="ship" title="ship" />
	</game-container>
</template>

<script lang="ts">
import { Component, InjectReactive, mixins } from 'nuxt-property-decorator';

import DevInspect from '~/components/DevInspect.vue';
import GameContainer from '~/components/GameContainer.vue';
import GameTitle from '~/components/GameTitle.vue';
import InventoryStackTile from '~/components/InventoryStackTile.vue';
import LoadingIndicator from '~/components/LoadingIndicator.vue';
import TickOffsetCountdown from '~/components/TickOffsetCountdown.vue';

import AwaitChangeMixin from '~/mixins/AwaitChangeMixin';
import ItemTypeData, { ItemTypeId } from '~/models/ItemTypeData';
import Planet from '~/models/Planet';
import Ship from '~/models/Ship';
import Warehouse from '~/models/Warehouse';
import { request } from '~/utils/request';
import GameButton from '../../../components/GameButton.vue';
import MoneyLabel from '../../../components/MoneyLabel.vue';
import ShipTypeData, { ShipTypeId } from '../../../models/ShipTypeData';

@Component({
	name: 'ShipContainerPage',
	components: { MoneyLabel, GameButton, TickOffsetCountdown, LoadingIndicator, InventoryStackTile, DevInspect, GameTitle, GameContainer },
})
export default class ShipContainerPage extends mixins(AwaitChangeMixin) {

	@InjectReactive()
	private readonly planets: Planet[];

	@InjectReactive()
	private readonly ships: Ship[];

	@InjectReactive()
	private readonly warehouses: Warehouse[];

	@InjectReactive()
	private readonly shipTypes: Record<ShipTypeId, ShipTypeData>;

	@InjectReactive()
	private readonly itemTypes: Record<ItemTypeId, ItemTypeData>;

	@InjectReactive()
	private readonly gameMinutesPerTick: number;

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

	private get shipType(): ShipTypeData {
		return this.shipTypes[this.ship.ship_type];
	}

	private get travelDestinations(): [Planet, number][] {
		let currentPlanet = this.planets.find(p => p.id === this.ship.planet_id);
		let destinations: [Planet, number][] = [];

		for (let planet of this.planets) {
			if (planet.id === this.ship.planet_id) {
				continue;
			}

			console.log('distance', planet.x, planet.y, planet.z, 'to', currentPlanet.x, currentPlanet.y, currentPlanet.z);
			let distance = Math.sqrt(
				Math.pow(planet.x - currentPlanet.x, 2)
				+ Math.pow(planet.y - currentPlanet.y, 2)
				+ Math.pow(planet.z - currentPlanet.z, 2)
			);
			console.log(distance);
			let minutes = Math.round(distance * 60 / this.shipType.speed / this.gameMinutesPerTick) * this.gameMinutesPerTick;
			destinations.push([planet, minutes]);
		}

		return destinations.sort((a, b) => a[0].name.localeCompare(b[0].name));
	}

	private get warehouseFilled(): number {
		let total = 0;
		for (let [id, stack] of Object.entries(this.warehouse.inventory)) {
			let volume = stack.amount * this.itemTypes[id].volume;
			total += volume;
		}
		return total;
	}

	private get warehouseFilledPercentage(): number {
		return this.warehouseFilled / this.warehouse.capacity;
	}

	private get shipFilled(): number {
		let total = 0;
		for (let [id, stack] of Object.entries(this.ship.inventory)) {
			let volume = stack.amount * this.itemTypes[id].volume;
			total += volume;
		}
		return total;
	}

	private get shipFilledPercentage(): number {
		return this.shipFilled / this.shipType.capacity;
	}

	private async travelTo(planetId: number): Promise<void> {
		this.loading = true;

		let body = { planetId };
		await request('post', `ships/${ this.shipId }/travel`, { body, json: true });
		await this.$change('ship', (ship: Ship) => ship.movement_minutes_remaining > 0);
		this.loading = false;
	}

	private async transfer(to: 'ship' | 'warehouse', itemTypeId: ItemTypeId, amount: number) {
		let body = { to, itemTypeId, amount };
		await request('post', `ships/${ this.shipId }/transfer`, { body, json: true });
	}
}
</script>
