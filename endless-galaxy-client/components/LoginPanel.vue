<template>
	<loading-indicator v-if="$fetchState.pending || loading" />

	<game-button v-else-if="isAuthenticated" to="game">{{ $t('open_game_link') }}</game-button>

	<form v-else @submit.stop.prevent="onSubmit">
		<div v-if="error" class="px-4 py-3 mb-6 border-2 border-red-500 text-red-50 text-sm rounded">
			<p class="font-mono" v-if="Array.isArray(error.errors)" v-for="entry in error.errors">
				{{ entry.field }}: {{ entry.rule }}
			</p>
			<pre class="font-mono" v-else>{{ error }}</pre>
		</div>

		<label>
			<span>{{ $t('login.email') }}:</span>
			<input type="email" name="email" />
		</label>

		<label>
			<span>{{ $t('login.password') }}:</span>
			<input type="password" name="password" />
		</label>

		<input type="submit" :value="$t('login.action')" />
	</form>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { request, RequestError } from '../utils/request';
import GameButton from './GameButton.vue';
import LoadingIndicator from './LoadingIndicator.vue';

@Component({
	name: 'LoginPanel',
	components: { GameButton, LoadingIndicator },
})
export default class LoginPanel extends Vue {

	private isAuthenticated: boolean = false;
	private loading: boolean = false;
	private error: any = null;

	async fetch() {
		try {
			await request('get', 'user');
			this.isAuthenticated = true;
		} catch (_) {}
	}

	onSubmit(evt: Event) {
		let form = evt.target as HTMLFormElement;
		let body = new FormData(form);

		return this.login(body);
	}

	async login(body: FormData) {
		this.loading = true;

		try {
			await request('post', 'auth/login', { body });
			await this.$router.push(this.localePath({ name: 'game' }));
		} catch (err) {
			if (err instanceof RequestError) {
				if (err.hasError('exists')) {
					return this.register(body);
				}
				this.error = err.body;
			} else {
				this.error = err;
			}
			this.loading = false;
		}
	}

	async register(body: FormData) {
		this.loading = true;

		try {
			await request('post', 'auth/register', { body });
			await this.$router.push(this.localePath({ name: 'game' }));
		} catch (err) {
			if (err instanceof RequestError) {
				this.error = err.body;
			} else {
				this.error = err;
			}
			this.loading = false;
		}
	}
}
</script>
