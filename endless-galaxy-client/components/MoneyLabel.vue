<template>
	<span class="font-mono">{{ formatted }}</span>
</template>

<script lang="ts">
import formatter from 'format-number';
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component({
	name: 'MoneyLabel',
})
export default class MoneyLabel extends Vue {

	@Prop({ required: true }) amount: number;
	@Prop({ default: true }) separateThousands: boolean;

	get formatter(): (number) => string {
		return formatter({
			prefix: '¢ ',
			integerSeparator: this.separateThousands ? ' ' : '',
			negativeLeftOut: false,
			decimal: ',',
			round: 2,
			padRight: 2,
		});
	}

	get formatted(): string {
		return this.formatter(this.amount / 100);
	}
}
</script>
