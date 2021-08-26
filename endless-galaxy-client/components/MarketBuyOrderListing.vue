<template>
	<div class="relative py-0.5 px-3 -mx-3 odd:bg-gray-700 odd:bg-opacity-25 rounded">
		<loading-indicator v-if="loading" class="absolute top-0 left-0 w-full h-full" />
		<div class="flex items-center space-x-4" :class="loading ? 'opacity-25 pointer-events-none' : ''">
			<item-icon :item-type-id="order.item_type" />
			<div class="flex-grow">
				<p class="font-semibold mr-4">{{ $t(`itemType.${ order.item_type }`) }}</p>
				<div class="flex items-center space-x-2 pb-px text-xs font-mono">
					<span>
						<money-label class="text-gray-100" :amount="order.price" />
					</span>
					<span class="text-gray-300" :class="isOwnOrder ? '' : 'cursor-pointer'"
						  @click="resetAmount">x{{ order.amount }}</span>
				</div>
			</div>
			<form v-if="hasWarehouse && amountInWarehouse > 0 && !isOwnOrder" class="flex-none flex items-center"
				  @submit.stop.prevent="sell">
				<input type="number" class="NoStyle bg-gray-900 rounded w-16 text-right font-mono text-sm py-1 px-2"
					   onclick="select()" v-model="amount" />
				<span class="text-gray-400 mx-0.5">/</span>
				<game-tooltip text="In warehouse">
					<p class="font-mono leading-3 text-sm text-gray-100">{{ amountInWarehouse }}</p>
				</game-tooltip>
			</form>
			<div class="flex-none text-right text-sm">
				<game-button
					v-if="isOwnOrder"
					size="small"
					:type="loading ? 'disabled' : 'subtle'"
					@click="deleteOrder">
					Remove
				</game-button>
				<game-button
					v-else-if="hasWarehouse && amountInWarehouse === 0"
					size="small"
					type="disabled">
					Not in warehouse
				</game-button>
				<game-button
					v-else-if="hasWarehouse"
					size="small"
					:type="loading ? 'disabled' : 'default'"
					@click="sell">
					Sell
				</game-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue, Watch } from 'nuxt-property-decorator';

import MarketSellOrder from '~/models/MarketSellOrder';
import User from '~/models/User';
import Warehouse from '~/models/Warehouse';
import { request } from '~/utils/request';

import GameButton from './GameButton.vue';
import GameTooltip from './GameTooltip.vue';
import ItemIcon from './ItemIcon.vue';
import LoadingIndicator from './LoadingIndicator.vue';
import MoneyLabel from './MoneyLabel.vue';

@Component({
	name: 'MarketBuyOrderListing',
	components: { GameTooltip, ItemIcon, GameButton, MoneyLabel, LoadingIndicator },
})
export default class MarketBuyOrderListing extends Vue {

	@Prop({ required: true })
	public readonly order: MarketSellOrder;

	@InjectReactive()
	private readonly warehouse: Warehouse | null;

	@InjectReactive()
	private readonly user: User;

	private amount: number = this.order.amount;
	private loading: boolean = false;

	private get isOwnOrder(): boolean {
		return this.order.user_id === this.user.id;
	}

	private get hasWarehouse(): boolean {
		return this.warehouse != null;
	}

	private get amountInWarehouse(): number {
		return this.warehouse.inventory[this.order.item_type]?.amount ?? 0;
	}

	private get price(): number {
		return this.order.price * this.amount;
	}

	@Watch('amount')
	private onAmountChanged() {
		let amount = this.amount;

		if (amount < 1) {
			amount = 1;
		}
		if (amount > this.order.amount) {
			amount = this.order.amount;
		}
		if (amount > this.amountInWarehouse) {
			amount = this.amountInWarehouse;
		}

		this.amount = amount;
	}

	private resetAmount(): void {
		this.amount = this.order.amount;
	}

	private async sell(): Promise<void> {
		this.loading = true;
		let body = { amount: this.amount };
		await request('post', `market-buy-orders/${ this.order.id }/sell`, { body, json: true });
		this.loading = false;
	}

	private async deleteOrder(): Promise<void> {
		this.loading = true;
		await request('delete', `market-buy-orders/${ this.order.id }`);
	}
}
</script>
