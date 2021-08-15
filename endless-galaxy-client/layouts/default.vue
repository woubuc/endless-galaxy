<template>
	<div>
		<Nuxt />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
	name: 'DefaultLayout',
})
export default class DefaultLayout extends Vue {

}
</script>
