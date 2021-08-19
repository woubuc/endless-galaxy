<template>
	<game-container class="flex items-stretch my-6">
		<div class="flex-none w-52 border-r-2 border-gray-700">
			<slot />
		</div>
		<nuxt-child class="flex-grow" />
	</game-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import GameContainer from './GameContainer.vue';

@Component({
	name: 'TabbedPage',
	components: { GameContainer },
})
export default class TabbedPage extends Vue {

}
</script>
