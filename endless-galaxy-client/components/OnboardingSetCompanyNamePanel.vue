<template>
	<loading-indicator v-if="loading" class="h-screen" />
	<div v-else class="flex items-center justify-center h-screen">
		<form @submit="saveCompanyName" class="w-full max-w-sm">
			<label>
				<span>{{ $t('onboarding.company_name') }}</span>
				<input autofocus="autofocus" type="text" name="companyName" minlength="6" />
			</label>

			<input type="submit" :value="$t('onboarding.save')" />
		</form>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { request } from '../utils/request';
import LoadingIndicator from './LoadingIndicator.vue';

@Component({
	name: 'OnboardingSetCompanyNamePanel',
	components: { LoadingIndicator },
})
export default class OnboardingSetCompanyNamePanel extends Vue {

	private loading = false;

	async saveCompanyName(evt: Event) {
		this.loading = true;
		let body = new FormData(evt.target as HTMLFormElement);
		await request('patch', 'user', { body });
	}

}
</script>
