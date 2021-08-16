<template>
	<div class="flex items-center justify-center h-screen p-12">
		<loading-indicator v-if="$fetchState.pending" />
		<div v-else-if="error" class="px-6 py-4 border-2 border-rose-500 rounded">
			{{ $t(error) }}
		</div>
		<div v-else class="px-6 py-4 text-center max-w-xl">
			<p class="font-medium text-lg">{{ $t('verify_email.verified') }}</p>
			<p class="mb-6 text-gray-300">{{ $t('verify_email.verified_text') }}</p>
			<nuxt-link :to="localePath({ name: 'game' })">{{ $t('verify_email.verified_action') }}</nuxt-link>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import { request, RequestError } from '../utils/request';

@Component({
	name: 'VerifyEmailPage',
	components: { LoadingIndicator },
})
export default class VerifyEmailPage extends Vue {

	private error: string | null = null;

	async fetch() {
		let body = new FormData();
		body.set('email', this.$route.query.email.toString());
		body.set('token', this.$route.query.token.toString());

		try {
			await request('post', 'auth/verify-email', { body });
		} catch (err) {
			if (err instanceof RequestError && err.status === 400) {
				this.error = 'error.invalid_token';
			} else {
				this.error = err.body;
			}
		}
	}
}
</script>
