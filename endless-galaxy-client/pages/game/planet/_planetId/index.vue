<template>
	<div class="px-6">
		<pre>// TODO</pre>
		<pre>{{ planet }}</pre>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';

import Planet from '~/models/Planet';

import GameButton from '~/components/GameButton.vue';

import IconBuy from '~/assets/icons/buy.svg?inline';

@Component({
	name: 'PlanetOverviewPage',
	components: { GameButton, IconBuy },
})
export default class PlanetOverviewPage extends Vue {

	@InjectReactive()
	private readonly planet: Planet;
}
</script>
