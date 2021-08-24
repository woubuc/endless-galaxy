<template>
	<div class="ml-6">
		<game-title>{{ $t('planet.settlement') }}</game-title>
		<p>{{ $t('settlement.population', [this.planet.population]) }}</p>

		<game-title size="small">{{ $t('settlement.demand_items') }}</game-title>
		<div class="flex flex-wrap gap-2 px-4 py-2 bg-gray-900 rounded">
			<item-icon v-for="id of planet.population_demands" :key="id" :item-type-id="id" />
		</div>
		<p class="p-2 text-sm text-gray-300">
			Inhabitants will ty to buy these products from sell orders on the <nuxt-link :to="localePath({ name: 'game-planet-planetId-market', params: $route.params })">market</nuxt-link>.
		</p>
		<dev-inspect :data="planet" title="planet" />
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, mixins } from 'nuxt-property-decorator';

import IconBuy from '~/assets/icons/buy.svg?inline';

import DevInspect from '~/components/DevInspect.vue';
import GameButton from '~/components/GameButton.vue';
import GameTitle from '~/components/GameTitle.vue';
import LoadingIndicator from '~/components/LoadingIndicator.vue';
import MoneyLabel from '~/components/MoneyLabel.vue';

import AwaitChangeMixin from '~/mixins/AwaitChangeMixin';
import Planet from '~/models/Planet';
import ConstructionTileRecipeItem from '../../../../components/ConstructionTileRecipeItem.vue';
import ItemIcon from '../../../../components/ItemIcon.vue';

@Component({
	name: 'PlanetOverviewPage',
	components: { ItemIcon, ConstructionTileRecipeItem, GameTitle, LoadingIndicator, MoneyLabel, DevInspect, GameButton, IconBuy },
})
export default class PlanetOverviewPage extends mixins(AwaitChangeMixin) {

	@InjectReactive()
	private readonly planet: Planet;
}
</script>
