<template>
	<div class="px-12 py-6">

		<dev-inspect :data="warehouses" title="warehouses" />
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';
import DevInspect from '../../components/DevInspect.vue';
import Warehouse from '../../models/Warehouse';

@Component({
	name: 'CompanyPage',
	components: { DevInspect },
})
export default class CompanyPage extends Vue {

	@InjectReactive()
	private readonly warehouses: Warehouse[];
}
</script>
