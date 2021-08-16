<template>
	<nuxt-link
		:to="route"
		class="
			inline-block rounded bg-violet-800 text-white font-semibold
			hover:bg-violet-600 hover:no-underline focus:bg-violet-600 focus:no-underline
			focus:visible:ring-2 ring-cyan-500 focus-visible:outline-none"
		:class="sizeClasses" @click.native="onClick">
		<slot />
	</nuxt-link>
</template>

<script lang="ts">
import * as camelcase from 'camelcase';
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component({
	name: 'GameButton',
})
export default class GameButton extends Vue {

	@Prop({ default: '' }) to: string;
	@Prop({ default: 'normal' }) size: 'small' | 'normal' | 'large';

	get route(): string {
		let params: Record<string, string> = {};
		for (let [key, value] of Object.entries(this.$attrs)) {
			params[camelcase(key)] = value;
		}

		return this.localePath({ name: this.to, params });
	}

	get sizeClasses(): string {
		switch (this.size) {
			case 'small': return 'px-2.5 py-1 text-sm';
			case 'large': return 'px-5 py-3';
			default: return 'px-4 py-1.5';
		}
	}

	private onClick(evt: Event) {
		if (this.to.length === 0) {
			evt.preventDefault();
			evt.stopPropagation();
			this.$emit('click');
		}
	}
}
</script>
