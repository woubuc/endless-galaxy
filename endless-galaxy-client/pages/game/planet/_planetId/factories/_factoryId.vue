<template>
	<nuxt-child v-if="factory" />
</template>

<script lang="ts">
import { Component, InjectReactive, ProvideReactive, Vue, Watch } from 'nuxt-property-decorator';
import { Factory } from '~/models/Factory';

@Component({
	name: 'FactoryParentPage',
})
export default class FactoryParentPage extends Vue {

	@InjectReactive()
	private readonly planetFactories: Factory[];

	@ProvideReactive()
	private get factoryId(): number {
		return parseInt(this.$route.params.factoryId, 10);
	}

	@ProvideReactive()
	private get factory(): Factory | undefined {
		return this.planetFactories.find(factory => factory.id === this.factoryId);
	}

	@Watch('factory', { immediate: true })
	private onFactoryChanged() {
		if (this.factory == undefined) {
			this.$router.replace(this.localePath({
				name: 'game-planet-planetId-buildings',
				params: this.$route.params,
			}));
		}
	}
}
</script>
