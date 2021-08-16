<template>
	<nuxt-link
		:to="route"
		class="group TabbedPageTab">
		<component :is="icon" class="h-6 mr-1 opacity-60" />
		<span>
			<span class="block font-medium">{{ title }}</span>
			<span v-if="subtitle.length > 0" class="block -mt-1 text-xs opacity-60">{{ subtitle }}</span>
		</span>
	</nuxt-link>
</template>

<script lang="ts">
import * as camelcase from 'camelcase';
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component({
	name: 'TabbedPageTab',
})
export default class TabbedPageTab extends Vue {

	@Prop({ required: true }) icon: Vue;
	@Prop({ required: true }) title: string;
	@Prop({ default: '' }) subtitle: string;

	@Prop({ required: true }) to: string;

	get route(): string {
		let params: Record<string, string> = this.$route.params;
		for (let [key, value] of Object.entries(this.$attrs)) {
			params[camelcase(key)] = value;
		}

		return this.localePath({ name: this.to, params });
	}
}
</script>

<style scoped>
.TabbedPageTab {
	@apply flex items-center space-x-2 my-2 px-4 py-2
		border-2 border-r-0 border-gray-700 text-gray-100 rounded-none rounded-l;
}
.TabbedPageTab:hover, .TabbedPageTab:focus {
	@apply no-underline bg-violet-600 text-white;
}
.TabbedPageTab:focus-visible {
	@apply outline-none ring-2 ring-cyan-500;
}
.TabbedPageTab.nuxt-link-exact-active {
	@apply bg-gray-700 text-white;
}
</style>
