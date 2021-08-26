<template>
	<div class="ml-6">
		<game-title>Create buy order</game-title>

		<div v-if="selectedItemTypeId === null" class="flex justify-center py-6">
			<form @submit.stop.prevent="selectFirstItem">
				<label>
					<span>Type to find item</span>
					<input ref="searchInput" type="text" v-model="searchQuery" class="w-80" />
				</label>

				<p v-for="([id, name], i) in filteredItemNames" v-if="i < 10"
				   class="flex items-center space-x-2 my-1 p-1"
				   :class="[
				   		i === 0 ? 'bg-gray-700 bg-opacity-50 rounded' : '',
				   		i === 7 ? 'opacity-70' : i === 8 ? 'opacity-50' : i === 9 ? 'opacity-30' : '',
				   	]">
					<item-icon :item-type-id="id" />
					<span class="flex-grow">{{ name }}</span>
					<game-button
						size="tiny"
						class="grayscale hover:grayscale-0 focus:grayscale-0"
						@click="selectItem(id)">
						Select
					</game-button>
				</p>
			</form>
		</div>

		<div v-else>
			<p class="flex items-center mb-6">
				<span class="text-gray-300">Buying</span>
				<item-icon :item-type-id="selectedItemTypeId" />
				<span>{{ $t(`itemType.${ selectedItemTypeId }`) }}</span>
			</p>

			<game-title size="small">{{ $t('market.sell_order_options') }}</game-title>

			<loading-indicator v-if="loading" />
			<form v-else class="space-y-2" @submit.stop.prevent="createOrder">
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
									ref="priceInput"
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
						<div>
							<input type="submit" value="Create buy order" />
						</div>
					</div>
					<span class="flex-grow" />
				</div>
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, mixins } from 'nuxt-property-decorator';

import GameButton from '~/components/GameButton.vue';
import GameTitle from '~/components/GameTitle.vue';
import ItemIcon from '~/components/ItemIcon.vue';
import LoadingIndicator from '~/components/LoadingIndicator.vue';
import MoneyLabel from '~/components/MoneyLabel.vue';

import TypedRefMixin from '~/mixins/TypedRefMixin';
import ItemTypeData, { ItemTypeId } from '~/models/ItemTypeData';
import { request } from '~/utils/request';

@Component({
	name: 'CreateBuyOrderPage',
	components: { LoadingIndicator, MoneyLabel, GameTitle, GameButton, ItemIcon },
})
export default class CreateBuyOrderPage extends mixins(TypedRefMixin) {

	@InjectReactive()
	private readonly planetId: number;

	@InjectReactive()
	private readonly itemTypes: Record<ItemTypeId, ItemTypeData>;

	private searchQuery: string = '';
	private selectedItemTypeId: ItemTypeId | null = null;

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

	private get itemNames(): [ItemTypeId, string][] {
		let names: [ItemTypeId, string][] = [];

		for (let id of Object.keys(this.itemTypes)) {
			names.push([id, this.$t(`itemType.${ id }`) as string]);
		}

		return names.sort((a, b) => a[1].localeCompare(b[1]));
	}

	private get filteredItemNames(): [ItemTypeId, string][] {
		if (this.searchQuery.length === 0) {
			return [];
		}

		return this.itemNames.filter(([id, name]) => name
			.toLowerCase()
			.includes(this.searchQuery.toLowerCase()),
		);
	}

	public mounted(): void {
		this.$ref<HTMLInputElement>('searchInput').focus();
	}

	private selectFirstItem(): void {
		this.selectItem(this.filteredItemNames[0][0]);
	}

	private selectItem(id: ItemTypeId): void {
		this.selectedItemTypeId = id;
		this.$nextTick(() => this.$ref<HTMLInputElement>('priceInput').focus());
	}

	private async createOrder(evt: Event): Promise<void> {
		this.loading = true;

		let body = JSON.stringify({
			planetId: this.planetId,
			itemType: this.selectedItemTypeId,
			price: this.parsedPrice,
			amount: this.parsedAmount,
		});
		await request('post', 'market-buy-orders', { body, json: true });

		await this.$router.push(this.localePath({
			name: 'game-planet-planetId-market',
			params: { planetId: this.planetId.toString() },
		}));
	}
}
</script>
