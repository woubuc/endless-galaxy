<template>
	<h2 class="my-6 first:mt-0 pb-1 font-semibold border-b-2 border-gray-700" :class="sizeClasses">
		<slot />
	</h2>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component({
	name: 'GameTitle',
})
export default class GameTitle extends Vue {

	@Prop({ default: 'default' })
	public readonly size: 'small' | 'default';

	private get sizeClasses(): string {
		switch (this.size) {
			case 'small': return 'text-gray-200';
			default: return 'text-white text-lg';
		}
	}
}
</script>
