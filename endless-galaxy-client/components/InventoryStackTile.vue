<template>
	<div v-if="stack.amount > 0" class="flex items-stretch p-2 rounded-sm border-2 border-gray-700">
		<div class="relative flex-none flex items-center justify-center w-16 mr-2.5 rounded-sm bg-black bg-opacity-20">
			<div class="absolute z-0 w-full h-full top-0 left-0 flex items-center justify-center p-2.5">
				<img :src="`/items/${ itemType }.svg`" />
			</div>
		</div>
		<div class="flex-grow pr-2">
			<p class="text-white font-semibold">{{ $t(`itemType.${ itemType }`) }}</p>
			<p class="text-xs text-gray-300 font-medium">
				<money-label :amount="stack.value" />{{ $t('inventory.each') }}
			</p>
			<p class="text-xs text-gray-300 font-medium font-mono">x{{ stack.amount }}</p>
			<div v-if="transfer" class="flex pt-1 space-x-1">
				<game-button size="tiny" @click="showTransferWindow">Transfer</game-button>
				<game-button size="tiny" @click="doTransfer(stack.amount)">All</game-button>
			</div>
		</div>

		<game-modal ref="transfer" title="Transfer" confirm="Transfer" @submit="doTransfer(transferAmount)">
			<form class="flex space-x-4" @submit.stop.prevent="doTransfer(transferAmount)">
				<input type="range" min="1" :max="stack.amount" v-model="transferAmount" />
				<input type="number" class="w-20 font-mono text-right" onfocus="select()" v-model="transferAmount" />
			</form>
		</game-modal>
	</div>
</template>

<script lang="ts">
import { Component, mixins, Prop, Vue } from 'nuxt-property-decorator';
import TypedRefMixin from '../mixins/TypedRefMixin';
import { InventoryStack } from '../models/InventoryStack';
import GameButton from './GameButton.vue';
import GameModal from './GameModal.vue';
import MoneyLabel from './MoneyLabel.vue';

@Component({
	name: 'InventoryStackTile',
	components: { GameModal, GameButton, MoneyLabel },
})
export default class InventoryStackTile extends mixins(TypedRefMixin) {
	@Prop({ required: true })
	public readonly itemType: string;

	@Prop({ required: true })
	public readonly stack: InventoryStack;

	@Prop({ default: false })
	public readonly transfer: boolean;

	private transferAmount: number = 1;

	private showTransferWindow(): void {
		this.$ref<GameModal>('transfer').show();
	}

	private doTransfer(amount: number): void {
		this.$ref<GameModal>('transfer').close();
		this.$emit('transfer', amount);
	}
}
</script>
