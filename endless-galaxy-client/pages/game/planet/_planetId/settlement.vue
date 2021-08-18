<template>
	<div class="px-6">
		<p class="text-lg py-2 border-b-2 border-gray-700 text-white font-semibold">Construction</p>

		<dev-inspect :data="planet" title="planet" />
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';

import Planet from '~/models/Planet';

import GameButton from '~/components/GameButton.vue';

import IconBuy from '~/assets/icons/buy.svg?inline';
import DevInspect from '../../../../components/DevInspect.vue';
import Warehouse from '../../../../models/Warehouse';

@Component({
	name: 'PlanetOverviewPage',
	components: { DevInspect, GameButton, IconBuy },
})
export default class PlanetOverviewPage extends Vue {

	@InjectReactive()
	private readonly planet: Planet;
}
</script>
