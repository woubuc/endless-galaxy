<template>
	<portal v-if="loaded">
		<div
			class="fixed top-0 left-0 flex items-center justify-center w-screen h-screen overflow-y-auto transition-opacity"
			:class="open ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none'">
			<div class="absolute z-40 top-0 left-0 w-full h-full bg-black bg-opacity-50" @click="close" />
			<div class="relative z-40 max-h-screen">
				<div
					class="px-8 py-5 bg-gray-800 rounded-lg shadow-xl transition-transform"
					:class="open ? 'translate-y-0' : '-translate-y-2'">
					<game-title v-if="title.length > 0" class="flex-none">{{ title }}</game-title>
					<slot v-if="loaded" />
					<div class="flex-none mt-6 pt-3 border-t-2 border-gray-700 text-right">
						<game-button v-if="confirm === false" @click="close">{{ $t('ui.close') }}</game-button>
						<div v-else class="flex items-center justify-end space-x-2">
							<game-button @click="submit">{{ confirm }}</game-button>
							<game-button @click="close" type="subtle">{{ $t('ui.cancel') }}</game-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</portal>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
import { Portal } from '@linusborg/vue-simple-portal';

import GameButton from './GameButton.vue';
import GameTitle from './GameTitle.vue';

@Component({
	name: 'GameModal',
	components: { GameButton, GameTitle, Portal },
})
export default class GameModal extends Vue {

	@Prop({ default: '' })
	public readonly title: string;

	@Prop({ default: false })
	public readonly confirm: false | string;

	/**
	 * Used to determine whether to render the slot content. Initially set to
	 * false to avoid rendering the slot content if the modal isn't actually
	 * opened.
	 */
	private loaded: boolean = false;

	private open: boolean = false;

	@Watch('open')
	private onOpenChanged(): void {
		if (this.open) {
			document.body.classList.add('overflow-y-hidden');
		} else {
			document.body.classList.remove('overflow-y-hidden');
		}
	}

	public show(): void {
		this.loaded = true;
		this.$nextTick(() => this.open = true);
	}

	public close(): void {
		this.open = false;
	}

	private submit(): void {
		this.$emit('submit');
		this.close();
	}
}
</script>
