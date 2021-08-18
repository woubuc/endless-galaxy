<template>
	<div class="flex items-stretch divide-x-2 divide-gray-700">
		<div class="flex flex-col flex-1 px-6">
			<div class="flex-none flex pb-1 mb-6 border-b-2 border-gray-700">
				<p class="text-lg flex-grow text-white font-semibold">{{ $t('market.sell_orders') }}</p>
				<game-button size="small" to="game-planet-planetId-market-sell">{{ $t('market.create_sell_order') }}</game-button>
			</div>
			<div class="flex-grow">
				<div
					v-for="order of sellOrders"
					:key="order.id"
					class="flex items-end space-x-4 py-1 px-3 -mx-3 odd:bg-gray-700 odd:bg-opacity-25 rounded">
					<span class="w-8 font-mono text-right text-gray-400 text-sm">x{{ order.amount }}</span>
					<span class="flex-grow font-medium">{{ $t(`itemType.${ order.item_type }`) }}</span>
					<span class="text-right text-gray-300 text-sm">
						<money-label :amount="order.price" /> ea.
					</span>
<!--					<div class="w-24 text-right text-sm">-->
<!--						<game-button v-if="Math.random() < 0.4" size="tiny">Remove</game-button>-->
<!--						<game-button v-else size="tiny">-->
<!--							<money-label :amount="order.price * order.amount" />-->
<!--						</game-button>-->
<!--					</div>-->
				</div>
				<dev-inspect :data="sellOrders" title="sellOrders" />
			</div>
		</div>
		<div class="flex flex-col flex-1 px-6">
			<div class="flex-none flex pb-1 mb-6 border-b-2 border-gray-700">
				<p class="text-lg flex-grow text-white font-semibold">{{ $t('market.buy_orders') }}</p>
				<game-button size="small" to="game-planet-planetId-market-buy">{{ $t('market.create_buy_order') }}</game-button>
			</div>
			<div class="flex-grow">
				<dev-inspect :data="marketBuyOrders" title="buyOrders" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';

import DevInspect from '~/components/DevInspect.vue';
import GameButton from '~/components/GameButton.vue';
import MoneyLabel from '../../../../../components/MoneyLabel.vue';
import MarketBuyOrder from '../../../../../models/MarketBuyOrder';
import MarketSellOrder from '../../../../../models/MarketSellOrder';

@Component({
	name: 'MarketPage',
	components: { MoneyLabel, DevInspect, GameButton },
})
export default class MarketPage extends Vue {
	@InjectReactive()
	private readonly marketSellOrders: MarketSellOrder[];

	@InjectReactive()
	private readonly marketBuyOrders: MarketBuyOrder[];

	get sellOrders(): MarketSellOrder[] {
		return this.marketSellOrders.sort((a, b) => {
			if (a.item_type !== b.item_type) {
				return a.item_type.localeCompare(b.item_type);
			}
			return a.price - b.price;
		})
	}
}
</script>
