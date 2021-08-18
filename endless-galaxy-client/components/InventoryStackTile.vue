<template>
	<div class="flex items-stretch w-52 h-20 p-2 rounded-sm border-2 border-gray-700">
		<div class="flex-none flex items-center justify-center w-14 mr-2.5 rounded-sm bg-black bg-opacity-20">
			<p class="font-mono text-gray-100 text-opacity-80 text-xs">{{ stack.amount }}</p>
		</div>
		<div class="flex-grow">
			<p class="text-white font-semibold">{{ $t(`itemType.${ itemType }`) }}</p>
			<p class="text-xs text-gray-300 font-medium">
				<money-label :amount="stack.value" />{{ $t('inventory.each') }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { InventoryStack } from '../models/InventoryStack';
import MoneyLabel from './MoneyLabel.vue';

@Component({
	name: 'InventoryStackTile',
	components: { MoneyLabel },
})
export default class InventoryStackTile extends Vue {
	@Prop({ required: true }) itemType: string;
	@Prop({ required: true }) stack: InventoryStack;
}
</script>
