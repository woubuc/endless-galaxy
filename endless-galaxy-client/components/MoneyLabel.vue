<template>
	<span class="font-mono">{{ formatted }}</span>
</template>

<script lang="ts">
import formatter from 'format-number';
import { Component, Prop, Vue } from 'nuxt-property-decorator';

const format = formatter({
	prefix: '¢ ',
	integerSeparator: ' ',
	negativeLeftOut: false,
	decimal: ',',
	round: 2,
	padRight: 2,
});

const formatNoThousandsSeparator = formatter({
	prefix: '¢ ',
	integerSeparator: '',
	negativeLeftOut: false,
	decimal: ',',
	round: 2,
	padRight: 2,
});

@Component({
	name: 'MoneyLabel',
})
export default class MoneyLabel extends Vue {

	@Prop({ required: true }) amount: number;
	@Prop({ default: true }) separateThousands: boolean;

	get formatted(): string {
		if (this.separateThousands) {
			return format(this.amount / 100);
		} else {
			return formatNoThousandsSeparator(this.amount / 100);
		}
	}
}
</script>
