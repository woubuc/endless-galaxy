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
					<span class="text-gray-300 cursor-pointer" @click="resetAmount">x{{ order.amount }}</span>
				</div>
			</div>
			<form v-if="!isOwnOrder" class="inline flex-none" @submit.stop.prevent="buyOrder">
				<input type="number" class="NoStyle bg-gray-900 rounded w-16 text-right font-mono text-sm py-1 px-2"
					   onclick="select()" v-model="amount" />
			</form>
			<div class="flex-none text-right text-sm">
				<game-button
					v-if="isOwnOrder"
					size="small"
					:type="loading ? 'disabled' : 'subtle'"
					@click="removeOrder">
					Remove
				</game-button>
				<game-button
					v-else
					size="small"
					:type="loading || !canAfford || amount === 0 ? 'disabled' : 'default'"
					@click="buyOrder">
					<money-label v-if="canAfford" :amount="price" />
					<span v-else>Can't afford</span>
				</game-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue, Watch } from 'nuxt-property-decorator';

import MarketSellOrder from '~/models/MarketSellOrder';
import User from '~/models/User';
import { request } from '~/utils/request';

import GameButton from './GameButton.vue';
import ItemIcon from './ItemIcon.vue';
import LoadingIndicator from './LoadingIndicator.vue';
import MoneyLabel from './MoneyLabel.vue';

@Component({
	name: 'MarketSellOrderListing',
	components: { ItemIcon, LoadingIndicator, GameButton, MoneyLabel },
})
export default class MarketSellOrderListing extends Vue {
	@Prop({ required: true })
	public readonly order: MarketSellOrder;

	@InjectReactive()
	private readonly user: User;

	private amount: number = this.order.amount;
	private loading: boolean = false;

	private get isOwnOrder(): boolean {
		return this.order.user_id === this.user.id;
	}

	private get price(): number {
		return this.order.price * this.amount;
	}

	private get canAfford(): boolean {
		return this.user.money >= this.price && this.user.money >= this.order.price;
	}

	@Watch('amount', { immediate: true })
	private onAmountChanged() {
		let amount = this.amount;

		if (amount > this.order.amount) {
			amount = this.order.amount;
		}
		if (amount * this.order.price > this.user.money) {
			amount = Math.floor(this.user.money / this.order.price);
		}
		if (amount < 1) {
			amount = 1;
		}

		this.amount = amount;
	}

	private resetAmount(): void {
		this.amount = this.order.amount;
	}

	private async buyOrder(): Promise<void> {
		if (this.loading || !this.canAfford || this.amount === 0) {
			return;
		}

		this.loading = true;
		let body = { amount: this.amount };
		await request('post', `market-sell-orders/${ this.order.id }/buy`, { body, json: true });
		this.loading = false;
	}

	private async removeOrder(): Promise<void> {
		if (this.loading) {
			return;
		}

		this.loading = true;
		await request('delete', `market-sell-orders/${ this.order.id }`);
		this.loading = false;
	}
}
</script>
