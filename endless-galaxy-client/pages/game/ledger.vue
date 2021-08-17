<template>
	<div class="px-12 py-6">
		<p class="text-white font-semibold">Yesterday's profits</p>

		<div v-for="[category, entries] of Object.entries(lastProfit.profit_data)" :key="category" class="my-6 px-6 py-3 border-2 border-gray-700 rounded">
			<p class="text-white font-semibold">{{ $t(`profit.${ category }`) }}</p>
			<div class="table">
				<div v-for="entry of entries" :key="entry.key + '_' + entry.meta" class="table-row">
					<div class="table-cell">
						<money-label :amount="entry.amounts.reduce((acc, i) => acc + i, 0)" />
					</div>
					<div class="table-cell px-5 py-1 text-gray-300">
						{{ $t('profit.multiple', [entry.amounts.length]) }}
						{{ $t(`profit.${ entry.key }`, [entry.meta]) }}
					</div>
				</div>
			</div>
		</div>

		<pre class="bg-gray-900 px-6 py-4 text-xs rounded">{{ lastProfit }}</pre>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';
import Profit from '~/models/Profit';
import MoneyLabel from '../../components/MoneyLabel.vue';

@Component({
	name: 'LedgerPage',
	components: { MoneyLabel },
})
export default class LedgerPage extends Vue {

	@InjectReactive()
	public lastProfit: Profit;
}
</script>
