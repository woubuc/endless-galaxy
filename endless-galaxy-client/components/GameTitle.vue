<template>
	<h2 class="mb-6 pb-1 text-lg font-semibold border-b-2 border-gray-700">
		<slot />
	</h2>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
	name: 'GameTitle',
})
export default class GameTitle extends Vue {

}
</script>
