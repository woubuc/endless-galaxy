<template>
	<div class="flex items-stretch px-12 my-6">
		<div class="flex-none w-52 border-r-2 border-gray-700">
			<slot />
		</div>
		<nuxt-child class="flex-grow" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
	name: 'TabbedPage',
})
export default class TabbedPage extends Vue {

}
</script>
