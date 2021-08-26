<template>
	<div class="inline-block relative px-3 py-1 w-64 bg-gray-900 rounded">
		<money-label
			:amount="parsedPrice"
			:separate-thousands="false"
			class="pointer-events-none text-gray-400" />
		<input
			type="text"
			:name="name"
			v-model="price"
			onfocus="select()"
			class="NoStyle absolute top-px left-0 z-10 w-full pl-8 pr-3 py-1 font-mono bg-transparent text-white focus:ring-2 ring-violet-500 rounded outline-none" />
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
import MoneyLabel from './MoneyLabel.vue';

@Component({
	name: 'MoneyInput',
	components: { MoneyLabel },
})
export default class MoneyInput extends Vue {

	@Prop({ default: 0 })
	public readonly value: number;

	@Prop({ default: '' })
	public readonly name: string;

	private price: string = '';

	get parsedPrice(): number {
		let str = this.price
			.replace(',', '.')
			.replace(/[^\d.]/g, '');

		let parsed = Math.round(parseFloat(str) * 100);
		if (Number.isNaN(parsed)) {
			return 0;
		}
		return parsed;
	}

	@Watch('value', { immediate: true })
	private onValueUpdate(): void {
		this.price = (this.value / 100).toString().toString();
	}

	@Watch('price')
	private onPriceChanged() {
		this.price = this.price
			.replace('.', ',')
			.replace(/[^\d,]/g, '');
	}

	@Watch('parsedPrice')
	private onParsedPriceChanged(): void {
		this.$emit('input', this.parsedPrice);
	}
}
</script>
