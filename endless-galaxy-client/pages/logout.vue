<template>
	<loading-indicator />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import { request } from '../utils/request';

@Component({
	name: 'LogoutPage',
	components: { LoadingIndicator },
})
export default class LogoutPage extends Vue {
	async mounted() {
		await request('post', 'auth/logout');
		await this.$router.push(this.localePath({ name: 'index' }));
	}
}
</script>
