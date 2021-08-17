<template>
	<form class="px-6" @submit.stop.prevent="order">
		<h2 class="mb-6 text-lg font-semibold">{{ $t('shipyard.order') }}</h2>

		<div class="space-y-2">
			<shipyard-ship-type-option
				:icon="require('~/assets/icons/space-shuttle.svg?inline')"
				ship-type-id="scout" />
			<shipyard-ship-type-option
				:icon="require('~/assets/icons/shipping-container.svg?inline')"
				ship-type-id="hauler" />
		</div>

		<div class="flex items-start h-20 w-48">
			<loading-indicator v-if="priceQuote == null && loading" class="mt-12" />
			<input v-else type="submit" :value="$t('shipyard.request_quote')" />
		</div>
		<div v-if="priceQuote != null" class="my-6 px-5 py-3 border-2 border-gray-700 rounded">
			<loading-indicator v-if="loading" />
			<div v-else-if="priceQuote === -1">
				<p class="font-medium text-white">{{ $t('shipyard.no_resources_title') }}</p>
				<p class="text-gray-200">{{ $t('shipyard.no_resources') }}</p>
			</div>
			<form v-else @submit.stop.prevent="confirmOrder">
				<p class="text-lg -mb-4">
					<money-label :amount="priceQuote" />
				</p>
				<input type="submit" :value="$t('shipyard.confirm_order')" />
			</form>
		</div>

		<div class="mt-8 pt-8 border-t-2 border-gray-700">
			<h2 class="text-lg font-semibold">{{ $t('shipyard.orders') }}</h2>

			<shipyard-order-entry v-for="order of orders" :key="order.id" :order="order" />
		</div>
	</form>
</template>

<script lang="ts">
import { Component, InjectReactive, mixins } from 'nuxt-property-decorator';

import AwaitChangeMixin from '~/mixins/AwaitChangeMixin';
import { request } from '~/utils/request';

import GameButton from '~/components/GameButton.vue';
import LoadingIndicator from '~/components/LoadingIndicator.vue';
import MoneyLabel from '~/components/MoneyLabel.vue';
import ShipyardShipTypeOption from '~/components/ShipyardShipTypeOption.vue';

import ShipTypeData from '~/models/ShipTypeData';
import Shipyard from '~/models/Shipyard';
import ShipyardOrder from '~/models/ShipyardOrder';
import ShipyardOrderEntry from '~/components/ShipyardOrderEntry.vue';

@Component({
	name: 'PlanetShipyardPage',
	components: { ShipyardOrderEntry, MoneyLabel, ShipyardShipTypeOption, LoadingIndicator, GameButton },
})
export default class PlanetShipyardPage extends mixins(AwaitChangeMixin) {

	@InjectReactive()
	private readonly shipyard: Shipyard;

	@InjectReactive()
	private readonly shipyardOrders: ShipyardOrder[];

	@InjectReactive()
	private readonly shipTypes: Record<string, ShipTypeData>;

	private loading = false;

	private priceQuote: number | null = null;

	get orders(): ShipyardOrder[] {
		return this.shipyardOrders
			.filter(o => o.shipyard_id === this.shipyard.id)
			.filter(o => o.work_remaining > 0);
	}

	private async order(evt: Event) {
		this.loading = true;
		this.priceQuote = null;

		let body = new FormData(evt.target as HTMLFormElement);
		let priceQuote = await request<{ totalCost?: number }>('post', `shipyards/${ this.shipyard.id }/order`, { body });
		console.log('price quote:', priceQuote);

		if (priceQuote.totalCost) {
			this.priceQuote = priceQuote.totalCost;
		} else {
			this.priceQuote = -1;
		}

		this.loading = false;
	}

	private async confirmOrder() {
		this.loading = true;
		let { id } = await request('post', `shipyards/${ this.shipyard.id }/confirm-order`);
		await this.$change('shipyardOrders', orders => orders.some(o => o.id === id));
		this.priceQuote = null;
		this.loading = false;
	}
}
</script>
