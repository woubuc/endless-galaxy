<template>
	<div class="w-64 px-3 py-2 border-2 border-gray-700 rounded">
		<div class="flex items-center space-x-2 -ml-2 mb-1">
			<item-icon :item-type-id="itemTypeId" />
			<p class="flex-grow font-medium">{{ $t(`itemType.${ itemTypeId }`) }}</p>
			<game-button size="tiny" type="subtle" @click="edit">
				<span v-if="isActive">Configure</span>
				<span v-else>Set up</span>
			</game-button>
		</div>

		<loading-indicator v-if="loading" />
		<p v-else-if="!isActive" class="text-sm text-gray-500">Auto trading disabled</p>
		<div v-else class="flex items-center">
			<div class="flex-grow text-sm text-gray-300">
				<p v-if="trader.sell">
					<span v-if="trader.sellMode === 'lowest'">Lowest price</span>
					<template v-else>
						<span v-if="trader.sellMode === 'fixed'">Sell:</span>
						<span v-if="trader.sellMode === 'profit'">Profit:</span>
						<money-label :amount="trader.sellPrice" />
					</template>
				</p>
				<p v-if="trader.buy">
					Buy:
					<money-label :amount="trader.buyPrice" />
				</p>
			</div>
			<div class="flex items-center space-x-1.5 ml-4">
				<p class="text-xs text-gray-400">Target</p>
				<p class="px-1.5 py-px text-sm font-mono bg-gray-700 rounded">{{ amount }}</p>
			</div>
		</div>

		<game-modal
			ref="configure"
			:title="`${ $t(`itemType.${ itemTypeId }`) } auto trader`"
			confirm="Save"
			@submit="save">
			<form @submit.stop.prevent="save" class="w-64">
				<label>
					<span>Desired {{ $t(`itemType.${ itemTypeId }`) }} in stock</span>
					<input type="number" name="amount" class="w-24 font-mono" v-model="amount" onfocus="select()" />
				</label>

				<game-title size="small">Auto sell</game-title>
				<label class="flex items-center space-x-2">
					<input type="checkbox" name="sell" v-model="sell" />
					<span>
						Sell
						<span class="text-gray-400">when inventory exceeds {{ amount }}</span>
					</span>
				</label>

				<template v-if="sell">
					<label>
						<span>Pricing</span>
						<select name="sellMode" v-model="sellMode" class="w-full">
							<option value="fixed">Fixed price</option>
							<option value="profit">Maintain profit</option>
							<option value="lowest">Lowest</option>
						</select>
						<span v-if="sellMode === 'market'" class="text-gray-400 italic pt-1">Items will be sold at the current market value</span>
						<span v-else-if="sellMode === 'lowest'" class="text-gray-400 italic pt-1">Items will be sold at <money-label
							:amount="1" class="text-xs text-gray-300 mr-px" /> below the current lowest offer on the market</span>
					</label>

					<label v-if="sellMode === 'fixed' || sellMode === 'profit'">
						<span v-if="sellMode === 'fixed'">Sale price per item</span>
						<span v-else-if="sellMode === 'profit'">Mark up per item</span>
						<money-input name="sellPrice" v-model="sellPrice" />
					</label>

					<template v-if="canAvoidLoss">
						<label class="flex items-center space-x-2">
							<input type="checkbox" name="sellAvoidLoss" v-model="sellAvoidLoss" />
							<span>Don't sell items at a loss</span>
						</label>
						<span v-if="sellAvoidLoss" class="text-sm italic text-gray-400">No sell orders will be created if the configured price is lower than the cost of the items.</span>
					</template>
				</template>


				<game-title size="small">Auto buy</game-title>
				<label class="flex items-center space-x-2">
					<input type="checkbox" name="sell" v-model="buy" />
					<span>Buy</span>
					<span class="text-gray-400">when inventory is below {{ amount }}</span>
				</label>

				<label v-if="buy">
					<span>Purchase price</span>
					<money-input name="buyPrice" v-model="buyPrice" />
				</label>


				<input type="submit" class="hidden">
			</form>
		</game-modal>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, mixins, Prop, Watch } from 'nuxt-property-decorator';

import TypedRefMixin from '~/mixins/TypedRefMixin';
import AutoTraderConfig, { AutoTraderBuyMode, AutoTraderSellMode } from '~/models/AutoTraderConfig';
import Warehouse from '~/models/Warehouse';
import { request } from '~/utils/request';

import GameButton from './GameButton.vue';
import GameModal from './GameModal.vue';
import GameTitle from './GameTitle.vue';
import ItemIcon from './ItemIcon.vue';
import LoadingIndicator from './LoadingIndicator.vue';
import MoneyInput from './MoneyInput.vue';
import MoneyLabel from './MoneyLabel.vue';

@Component({
	name: 'WarehouseAutoTradingEntry',
	components: { MoneyInput, MoneyLabel, LoadingIndicator, GameTitle, GameModal, GameButton, ItemIcon },
})
export default class WarehouseAutoTradingEntry extends mixins(TypedRefMixin) {

	@Prop({ required: true })
	public readonly itemTypeId: string;

	@InjectReactive()
	private readonly warehouse: Warehouse;

	private loading: boolean = false;

	private amount: number = 0;

	private sell: boolean = false;
	private sellMode: AutoTraderSellMode = AutoTraderSellMode.Fixed;
	private sellPrice: number = 0;
	private sellAvoidLoss: boolean = false;

	private buy: boolean = false;
	private buyMode: AutoTraderBuyMode = AutoTraderBuyMode.Fixed;
	private buyPrice: number = 0;

	private get isActive(): boolean {
		if (this.trader == null) {
			return false;
		}
		return this.trader.buy || this.trader.sell;
	}

	private get trader(): AutoTraderConfig | null {
		return this.warehouse.auto_trader[this.itemTypeId] ?? null;
	}

	private get traderOrDefault(): AutoTraderConfig {
		return this.trader ?? {
			amount: 0,

			sell: false,
			sellMode: AutoTraderSellMode.Fixed,
			sellPrice: 0,
			sellAvoidLoss: true,

			buy: false,
			buyMode: AutoTraderBuyMode.Fixed,
			buyPrice: 0,
		};
	}

	private get canAvoidLoss(): boolean {
		return this.sellMode !== AutoTraderSellMode.LowestOnMarket
			&& this.sellMode !== AutoTraderSellMode.ProfitMargin;
	}

	@Watch('trader', { immediate: true })
	private onTraderChanged() {
		this.amount = this.traderOrDefault.amount;

		this.sell = this.traderOrDefault.sell;
		this.sellPrice = this.traderOrDefault.sellPrice;
		this.sellMode = this.traderOrDefault.sellMode;
		this.sellAvoidLoss = this.traderOrDefault.sellAvoidLoss;

		this.buy = this.traderOrDefault.buy;
		this.buyMode = this.traderOrDefault.buyMode;
	}

	private edit(): void {
		this.$ref<GameModal>('configure').show();
	}

	private async save(): Promise<void> {
		this.$ref<GameModal>('configure').close();
		this.loading = true;

		let body = JSON.stringify({
			amount: this.amount,

			sell: this.sell,
			sellMode: this.sellMode,
			sellPrice: this.sellPrice,
			sellAvoidLoss: this.sellAvoidLoss,

			buy: this.buy,
			buyMode: AutoTraderBuyMode.Fixed,
			buyPrice: this.buyPrice,
		});

		await request('put', `warehouses/${ this.warehouse.id }/auto-traders/${ this.itemTypeId }`, {
			body,
			json: true,
		});

		this.loading = false;
	}
}
</script>
