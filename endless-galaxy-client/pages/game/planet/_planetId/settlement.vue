<template>
	<div class="ml-6">
		<game-title>{{ $t('planet.settlement') }}</game-title>

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

@Component({
	name: 'PlanetOverviewPage',
	components: { GameTitle, LoadingIndicator, MoneyLabel, DevInspect, GameButton, IconBuy },
})
export default class PlanetOverviewPage extends mixins(AwaitChangeMixin) {

	@InjectReactive()
	private readonly planet: Planet;
}
</script>
