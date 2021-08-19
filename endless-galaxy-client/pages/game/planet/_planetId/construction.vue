<template>
	<div class="ml-6">
		<game-title>Construction</game-title>

		<construction-warehouse-tile />

		<div v-if="warehouse == null">
			<p>Build a warehouse to unlock other building projects on this planet</p>
		</div>
		<div v-else>

			<game-title size="small">Production buildings</game-title>
			<div class="flex flex-wrap items-stretch gap-4">
				<construction-factory-tile
					v-for="factoryType of Object.values(factoryTypes)"
					:factory-type="factoryType" />
			</div>

			<game-title size="small">Shops</game-title>
			<div class="flex flex-wrap items-stretch gap-4">
				<construction-shop-tile
					v-for="shopType of Object.values(shopTypes)"
					:shop-type="shopType" />
			</div>

		</div>

		<dev-inspect :data="factoryTypes" title="factoryTypes" />
		<dev-inspect :data="shopTypes" title="shopTypes" />
		<dev-inspect :data="recipes" title="recipes" />
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
	private readonly warehouse: Warehouse | null;

	@InjectReactive()
	private readonly factoryTypes: Record<FactoryTypeId, FactoryTypeData>;

	@InjectReactive()
	private readonly shopTypes: Record<ShopTypeId, ShopTypeData>;

}
</script>
