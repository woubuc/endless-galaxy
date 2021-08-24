<template>
	<div class="p-6 sm:p-16 md:p-24">
		<header class="p-12 mb-12 md:mb-24">
			<h1 class="text-center text-2xl font-semibold">{{ $t('title') }}</h1>
			<p class="text-center text-gray-300 text-sm font-light">{{ $t('subtitle') }}</p>
		</header>

		<div class="md:flex items-stretch justify-center">
			<div class="md:w-80 py-4 md:pr-8 md:mr-8 md:border-r border-gray-400">
				<login-panel />
			</div>

			<div class="space-y-4 max-w-2xl">
				<p class="font-semibold">Early testing - lots of stuff doesn't work yet.</p>
				<p class="text-gray-300">Become an interplanetary entrepreneur in Endless Galaxy. Build factories, transport goods, trade on markets, and sell your manufactured products to citizens across the universe.</p>
			</div>
		</div>

	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import LoginPanel from '../components/LoginPanel.vue';

@Component({
	name: 'IndexPage',
	components: { LoginPanel },
})
export default class IndexPage extends Vue {

}
</script>
