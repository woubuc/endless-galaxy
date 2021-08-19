<template>
	<nuxt-link
		:to="localePath({ name: to })"
		class="TopBarNavButton">
		<slot />
	</nuxt-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component({
	name: 'TopBarNavButton',
})
export default class TopBarNavButton extends Vue {

	@Prop({ required: true }) to: string;
}
</script>

<style scoped>
.TopBarNavButton {
	@apply px-4 py-2.5 flex items-center space-x-2
		border-2 border-b-0 last:border-b-2 sm:border-b-2 sm:border-r-0 sm:last:border-r-2
		rounded-none first:rounded-t sm:first:rounded-tr-none sm:first:rounded-l last:rounded-b sm:last:rounded-bl-none sm:last:rounded-r
		bg-gray-800 border-gray-700
		text-gray-300 font-semibold;
}
.TopBarNavButton:hover, .TopBarNavButton:focus {
	@apply no-underline bg-violet-600 text-white;
}
.TopBarNavButton:focus-visible {
	@apply ring-2 ring-cyan-500 outline-none;
}
.TopBarNavButton.nuxt-link-exact-active {
	@apply bg-gray-600 border-b-2 border-r-2 border-gray-600 text-white;
}
.TopBarNavButton.nuxt-link-exact-active + .TopBarNavButton {
	@apply border-t-0 sm:border-t-2 sm:border-l-0;
}
</style>
