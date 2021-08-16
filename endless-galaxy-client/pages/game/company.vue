<template>
	<div class="CompanyPage">
{{ warehouses }}
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';
import Warehouse from '../../models/Warehouse';

@Component({
	name: 'CompanyPage',
})
export default class CompanyPage extends Vue {

	@InjectReactive()
	private readonly warehouses: Warehouse[];
}
</script>
