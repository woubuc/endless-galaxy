<template>
	<div class="p-6 sm:p-16 md:p-24">
		<header class="p-12 mb-12 md:mb-24">
			<h1 class="text-center text-2xl font-semibold">{{ $t('title') }}</h1>
			<p class="text-center text-gray-300 text-sm font-light">{{ $t('subtitle') }}</p>
		</header>

		<div class="md:flex items-stretch">
			<div class="md:w-80 py-4 md:pr-8 md:mr-8 md:border-r border-gray-400">
				<login-panel />
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
