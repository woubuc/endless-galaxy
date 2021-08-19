<template>
	<div class="mx-4 sm:mx-6 md:mx-8 lg:mx-12">
		<slot />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
	name: 'GameContainer',
})
export default class GameContainer extends Vue {

}
</script>
