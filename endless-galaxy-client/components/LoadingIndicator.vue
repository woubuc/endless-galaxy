<template>
	<div class="w-full flex items-center justify-center">
		<div class="flex items-center h-[13px] space-x-0.5">
			<div class="Bar Bar1"></div>
			<div class="Bar Bar2"></div>
			<div class="Bar Bar3"></div>
			<div class="Bar Bar4"></div>
			<div class="Bar Bar5"></div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
	name: 'LoadingIndicator',
})
export default class LoadingIndicator extends Vue {

}
</script>

<style scoped>
.Bar {
	width: 4px;
	height: 5px;
	border-radius: 2px;

	animation: bar 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.Bar1 {
	@apply bg-cyan-500;
	animation-delay: 100ms;
}
.Bar2 {
	@apply bg-blue-500;
	animation-delay: 250ms;
}
.Bar3 {
	@apply bg-indigo-500;
	animation-delay: 400ms;
}
.Bar4 {
	@apply bg-violet-500;
	animation-delay: 550ms;
}
.Bar5 {
	@apply bg-purple-500;
	animation-delay: 700ms;
}

@keyframes bar {
	0% { height: 5px }
	20% { height: 13px }
	40% { height: 5px }
	100% { height: 5px }
}
</style>
