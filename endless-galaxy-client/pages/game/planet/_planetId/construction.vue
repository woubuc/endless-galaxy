<template>
	<div>
		<game-title>Construction</game-title>

		<div v-if="!hasWarehouse" class="max-w-lg mx-auto my-12">
			<p>{{ $t('construction.no_warehouse') }}</p>
			<construction-warehouse-tile />
		</div>

		<div v-else>
			<game-title size="small">{{ $t('planet.buildings_factories') }}</game-title>
			<div class="flex flex-wrap items-stretch gap-4">
				<construction-factory-tile
					v-for="factoryType of Object.values(factoryTypes)"
					:key="factoryType.id"
					:factory-type="factoryType" />
			</div>

			<game-title size="small">{{ $t('planet.buildings_shops') }}</game-title>
			<div class="flex flex-wrap items-stretch gap-4">
				<construction-shop-tile
					v-for="shopType of Object.values(shopTypes)"
					:key="shopType.id"
					:shop-type="shopType" />
			</div>

		</div>

		<dev-inspect :data="factoryTypes" title="factoryTypes" />
		<dev-inspect :data="shopTypes" title="shopTypes" />
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';

import Warehouse from '~/models/Warehouse';

import ConstructionWarehouseTile from '~/components/ConstructionWarehouseTile.vue';
import GameTitle from '~/components/GameTitle.vue';
import ConstructionFactoryTile from '../../../../components/ConstructionFactoryTile.vue';
import ConstructionShopTile from '../../../../components/ConstructionShopTile.vue';
import DevInspect from '../../../../components/DevInspect.vue';
import GameButton from '../../../../components/GameButton.vue';
import MoneyLabel from '../../../../components/MoneyLabel.vue';
import FactoryTypeData, { FactoryTypeId } from '../../../../models/FactoryTypeData';
import RecipeData, { RecipeDataId } from '../../../../models/RecipeData';
import ShopTypeData, { ShopTypeId } from '../../../../models/ShopTypeData';

@Component({
	name: 'ConstructionPage',
	components: { ConstructionShopTile, ConstructionFactoryTile, GameButton, MoneyLabel, DevInspect, ConstructionWarehouseTile, GameTitle },
})
export default class ConstructionPage extends Vue {

	@InjectReactive()
	private readonly hasWarehouse: boolean;

	@InjectReactive()
	private readonly factoryTypes: Record<FactoryTypeId, FactoryTypeData>;

	@InjectReactive()
	private readonly shopTypes: Record<ShopTypeId, ShopTypeData>;

}
</script>
