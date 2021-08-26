<template>
	<loading-indicator v-if="loading" />
	<div v-else-if="!hasWarehouse">
		<p class="p-6 text-center">Build a warehouse on this planet before using the market</p>
	</div>
	<div v-else class="flex flex-col px-6">
		<game-title>{{ $t('market.select_item_to_sell') }}</game-title>

		<inventory-item-selector
			:inventory="warehouse.inventory"
			v-model="selectedItemType"
			class="mb-6" />

		<form v-if="selectedItemType.length > 0" class="flex-none space-y-2" @submit.stop.prevent="createOrder">
			<game-title>{{ $t('market.sell_order_options') }}</game-title>

			<div class="flex space-x-6">
				<div class="space-y-2">
					<div class="flex items-center space-x-4">
						<label class="w-14">Price</label>
						<div class="inline-block relative px-3 py-1 w-64 bg-gray-900 rounded">
							<money-label
								:amount="parsedPrice"
								:separate-thousands="false"
								class="pointer-events-none text-gray-400" />
							<input
								type="text"
								v-model="price"
								onfocus="select()"
								class="NoStyle absolute top-px left-0 z-10 w-full pl-8 pr-3 py-1 font-mono bg-transparent text-white focus:ring-2 ring-violet-500 rounded outline-none" />
						</div>
					</div>
					<div class="flex items-center space-x-4">
						<label class="w-14">Amount</label>
						<div class="inline-block w-64 bg-gray-900 rounded">
							<input
								type="text"
								v-model="amount"
								onfocus="select()"
								class="w-full px-3 py-1 font-mono bg-transparent text-white focus:ring-2 ring-violet-500 rounded outline-none" />
						</div>
					</div>
					<div class="flex items-center space-x-4">
						<span class="w-14">Total</span>
						<money-label :amount="parsedPrice * parsedAmount" />
					</div>
					<div class="flex items-center space-x-4">
						<span class="w-14">Profit</span>
						<money-label :amount="(parsedPrice - selectedStack.value) * parsedAmount" />
					</div>
					<div>
						<input type="submit" value="Create sell order" />
					</div>
				</div>
				<div>
					<div class="px-5 py-4 border-2 border-gray-700 rounded">
						<div v-if="Number.isFinite(lowestMarketPrice)">
							<p class="text-gray-300">Lowest price for {{ $t(`itemType.${ selectedItemType }`) }} on market</p>
							<money-label :amount="lowestMarketPrice" />
						</div>
						<p v-else>No offers on market</p>
					</div>
				</div>
				<span class="flex-grow" />
			</div>
		</form>

		<dev-inspect :data="selectedStack" title="selectedStack" />
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, mixins, Vue, Watch } from 'nuxt-property-decorator';

import Warehouse from '~/models/Warehouse';
import Planet from '~/models/Planet';
import { InventoryStack } from '~/models/InventoryStack';
import ItemTypeData from '~/models/ItemTypeData';
import { request } from '~/utils/request';
import AwaitChangeMixin from '~/mixins/AwaitChangeMixin';
import MarketSellOrder from '~/models/MarketSellOrder';

import DevInspect from '~/components/DevInspect.vue';
import GameButton from '~/components/GameButton.vue';
import GameTitle from '~/components/GameTitle.vue';
import InventoryStackTile from '~/components/InventoryStackTile.vue';
import LoadingIndicator from '~/components/LoadingIndicator.vue';
import MoneyLabel from '~/components/MoneyLabel.vue';

import IconChecked from '~/assets/icons/checked.svg?inline';
import InventoryItemSelector from '../../../../../components/InventoryItemSelector.vue';

@Component({
	name: 'CreateSellOrderPage',
	components: { InventoryItemSelector, GameButton, DevInspect, GameTitle, InventoryStackTile, MoneyLabel, LoadingIndicator, IconChecked },
})
export default class CreateSellOrderPage extends mixins(AwaitChangeMixin) {

	@InjectReactive()
	private readonly planet: Planet;

	@InjectReactive()
	private readonly warehouse: Warehouse | null;

	@InjectReactive()
	private readonly planetMarketSellOrders: MarketSellOrder[];

	@InjectReactive()
	private readonly itemTypes: Record<string, ItemTypeData>;

	private selectedItemType: string = '';

	private price = '';
	private amount = '';

	private loading = false;

	get parsedPrice(): number {
		let str = this.price
			.replace(',', '.')
			.replace(/[^\d.]/g, '');

		let parsed = Math.round(parseFloat(str) * 100);
		if (Number.isNaN(parsed)) {
			return 0;
		}
		return parsed;
	}

	get parsedAmount(): number {
		let parsed = parseInt(this.amount);
		if (Number.isNaN(parsed)) {
			return 0;
		}
		return parsed;
	}

	get hasWarehouse(): boolean {
		return this.warehouse != null;
	}

	get selectedStack(): InventoryStack | null {
		return this.warehouse.inventory[this.selectedItemType] ?? null;
	}

	get lowestMarketPrice(): number {
		if (this.selectedStack == null) {
			return 0;
		}

		return this.planetMarketSellOrders
			.filter(order => order.item_type == this.selectedItemType)
			.reduce((min, order) => Math.min(min, order.price), Infinity);
	}

	@Watch('selectedItemType')
	onSelectedItemChanged() {
		this.price = (this.selectedStack.value / 100).toString();
		this.amount = this.selectedStack.amount.toString();
	}

	@Watch('price')
	onPriceChanged() {
		this.price = this.price
			.replace('.', ',')
			.replace(/[^\d,]/g, '');
	}

	@Watch('amount')
	onAmountChanged() {
		let amount = parseInt(this.amount);
		if (Number.isNaN(amount)) {
			amount = 0;
		}
		if (amount > this.selectedStack.amount) {
			amount = this.selectedStack.amount;
		}
		this.amount = amount.toString();
	}

	private async createOrder() {
		this.loading = true;
		let body = JSON.stringify({
			planetId: this.planet.id,
			itemType: this.selectedItemType,
			price: this.parsedPrice,
			amount: this.parsedAmount,
		});

		let { id } = await request('post', 'market-sell-orders', { body, json: true });
		await this.$change('planetMarketSellOrders', (sellOrders: MarketSellOrder[]) => {
			return sellOrders.some(order => order.id === id);
		});

		await this.$router.push(this.localePath({
			name: 'game-planet-planetId-market',
			params: { planetId: this.planet.id.toString() },
		}));
	}
}
</script>
