<template>
	<game-tooltip :text="$t(`itemType.${ itemTypeId }`)" class="inline">
		<img :src="`/items/${ itemTypeId }.svg`" :alt="$t(`itemType.${ itemTypeId }`)" class="ml-2 w-6" />
	</game-tooltip>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { ItemTypeId } from '~/models/ItemTypeData';
import GameTooltip from './GameTooltip.vue';

@Component({
	name: 'ItemIcon',
	components: { GameTooltip },
})
export default class ItemIcon extends Vue {

	@Prop({ required: true })
	public readonly itemTypeId: ItemTypeId;

}
</script>
