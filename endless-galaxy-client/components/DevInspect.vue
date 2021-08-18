<template>
	<div v-if="isDev" class="w-full my-4 bg-gray-900 rounded-lg overflow-hidden text-xs">
		<p v-if="title.length > 0" class="-mb-1.5 px-5 py-2 bg-black bg-opacity-20 font-semibold">{{ title }}</p>
		<pre class="px-5 py-4">{{ data }}</pre>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component({
	name: 'DevInspect',
})
export default class DevInspect extends Vue {

	@Prop({ required: true }) public readonly data: any;
	@Prop({ default: '' }) public readonly title: string;

	get isDev(): boolean {
		return process.env.NODE_ENV === 'development';
	}
}
</script>
