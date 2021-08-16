<template>
	<div class="text-center p-12">
		<div class="mb-6">
			<p class="font-medium">{{ $t('verify_email.prompt') }}</p>
			<p class="font-light text-gray-300 text-sm">{{ $t('verify_email.prompt_secondary') }}</p>
		</div>
		<div class="h-20">
			<div v-if="sending || !canResend">
				<loading-indicator />
				<p v-if="!sending" class="w-2/3 mt-4 mx-auto text-gray-400 text-sm">{{ $t('verify_email.waiting_message') }}</p>
			</div>
			<div v-else>
				<p class="mb-1">{{ $t('verify_email.resend_prompt') }}</p>
				<game-button @click="resend">{{ $t('verify_email.resend') }}</game-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue, Watch } from 'nuxt-property-decorator';
import { differenceInMinutes } from 'date-fns'

import User from '~/models/User';
import { request } from '../utils/request';
import GameButton from './GameButton.vue';

import LoadingIndicator from './LoadingIndicator.vue';

@Component({
	name: 'VerifyEmailPanel',
	components: { GameButton, LoadingIndicator },
})
export default class VerifyEmailPanel extends Vue {

	@InjectReactive()
	private readonly user: User;

	@InjectReactive()
	private readonly time: number;

	private sending = false;

	get canResend(): boolean {
		let date = new Date(this.user.email_verify_sent);
		let elapsed = differenceInMinutes(new Date(this.time), date);
		return elapsed > 5;
	}

	@Watch('user')
	private onUserUpdated() {
		this.sending = false;
	}

	private async resend() {
		this.sending = true;
		await request('post', `auth/resend-verify-email`);
	}
}
</script>
