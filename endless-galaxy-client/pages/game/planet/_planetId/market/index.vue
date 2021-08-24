<template>
	<div class="flex items-stretch divide-x-2 divide-gray-700">
		<div class="flex flex-col flex-1 px-6">
			<div class="flex-none flex pb-1 mb-6 border-b-2 border-gray-700">
				<p class="text-lg flex-grow text-white font-semibold">{{ $t('market.sell_orders') }}</p>
				<game-button size="small" to="game-planet-planetId-market-sell">{{ $t('market.create_sell_order') }}</game-button>
			</div>
			<div class="flex-grow">
				<market-sell-order v-for="order of sellOrders" :key="order.id" :order="order" />

				<dev-inspect :data="sellOrders" title="sellOrders" />
			</div>
		</div>
		<div class="flex flex-col flex-1 px-6">
			<div class="flex-none flex pb-1 mb-6 border-b-2 border-gray-700">
				<p class="text-lg flex-grow text-white font-semibold">{{ $t('market.buy_orders') }}</p>
				<game-button size="small" to="game-planet-planetId-market-buy">{{ $t('market.create_buy_order') }}</game-button>
			</div>
			<div class="flex-grow">
				<dev-inspect :data="planetMarketBuyOrders" title="buyOrders" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';

import DevInspect from '~/components/DevInspect.vue';
import GameButton from '~/components/GameButton.vue';
import MarketSellOrder from '../../../../../components/MarketSellOrderListing.vue';
import MoneyLabel from '../../../../../components/MoneyLabel.vue';
import Market from '../../../../../models/Market';
import MarketBuyOrder from '../../../../../models/MarketBuyOrder';
import MarketSellOrder from '../../../../../models/MarketSellOrder';

@Component({
	name: 'MarketPage',
	components: { MarketSellOrder, MoneyLabel, DevInspect, GameButton },
})
export default class MarketPage extends Vue {

	@InjectReactive()
	private readonly planetMarketSellOrders: MarketSellOrder[];

	@InjectReactive()
	private readonly planetMarketBuyOrders: MarketBuyOrder[];

	get sellOrders(): MarketSellOrder[] {
		return this.planetMarketSellOrders.sort((a, b) => {
			if (a.item_type !== b.item_type) {
				return a.item_type.localeCompare(b.item_type);
			}
			return a.price - b.price;
		})
	}
}
</script>
