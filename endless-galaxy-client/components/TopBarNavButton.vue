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
	@apply px-4 flex items-center space-x-2
		border-2 border-r-0 last:border-r-2 bg-gray-800 border-gray-700 rounded-none first:rounded-l last:rounded-r
		text-gray-300 font-semibold;
}
.TopBarNavButton:hover, .TopBarNavButton:focus {
	@apply relative z-20 no-underline bg-violet-600 text-white;
}
.TopBarNavButton:focus-visible {
	@apply ring-2 ring-cyan-500 outline-none;
}
.TopBarNavButton.nuxt-link-exact-active {
	@apply bg-gray-600 border-r-2 border-gray-600 text-white;
}
.TopBarNavButton.nuxt-link-exact-active + .TopBarNavButton {
	@apply border-l-0;
}
</style>
