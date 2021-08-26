<template>
	<nuxt-link
		:to="route"
		class="
			inline-block rounded font-semibold
			hover:bg-violet-600 hover:text-white hover:no-underline
			focus:bg-violet-600 focus:text-white focus:no-underline
			focus:visible:ring-2 ring-cyan-500 focus-visible:outline-none"
		:class="[sizeClasses, typeClasses]" @click.native="onClick">
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

	@Prop({ default: '' })
	public readonly to: string;

	@Prop({ default: 'default' })
	public readonly size: 'tiny' | 'small' | 'default' | 'large';

	@Prop({ default: 'default' })
	public readonly type: 'subtle' | 'default' | 'disabled';

	get route(): string {
		let params: Record<string, string> = this.$route.params;
		for (let [key, value] of Object.entries(this.$attrs)) {
			params[camelcase(key)] = value;
		}

		return this.localePath({ name: this.to, params });
	}

	get sizeClasses(): string {
		switch (this.size) {
			case 'tiny': return 'px-2 py-1 text-xs';
			case 'small': return 'px-2.5 py-1 text-sm';
			case 'large': return 'px-5 py-3';
			default: return 'px-4 py-1.5';
		}
	}

	get typeClasses(): string {
		switch (this.type) {
			case 'subtle': return 'bg-gray-600 text-gray-200';
			case 'disabled': return 'bg-gray-700 text-gray-400 cursor-default hover:bg-gray-700 hover:text-gray-400';
			default: return 'bg-violet-800 text-white';
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
