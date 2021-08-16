<template>
	<div class="flex-none flex items-center mx-12 py-2 border-b-2 border-gray-700">
		<div>
			<p class="flex items-center my-1 text-xs">
				<icon-debt class="h-4 mr-2 text-gray-400" />
				<money-label class="text-gray-300" :amount="user.money_loaned" />
			</p>
			<p class="flex items-center my-1 text-xs">
				<icon-money-box class="h-4 mr-2 text-gray-400" />
				<money-label class="text-gray-300" :amount="user.money_loaned" />
			</p>
		</div>
		<top-bar-divider />
		<div class="mb-1">
			<p class="font-semibold text-right px-2.5 mb-1">
				<money-label :amount="user.money" />
			</p>
			<p class="flex justify-end items-center px-2.5 py-0.5 text-sm text-white bg-white bg-opacity-10 rounded">
				<icon-sort-up v-if="lastProfit.total > 0" class="h-4 mb-px mr-2 text-emerald-400" />
				<icon-sort-down v-else-if="lastProfit.total < 0" class="h-4 mt-px mr-2 text-rose-400" />
				<money-label :amount="lastProfit.total" />
			</p>
		</div>
		<top-bar-divider />
		<top-bar-date />
		<nav class="mx-8 self-stretch flex items-stretch">
			<top-bar-nav-button to="game">
				<icon-planet class="h-5" />
				<span>Planets</span>
			</top-bar-nav-button>
			<top-bar-nav-button to="game-businesses">
				<icon-group-of-companies class="h-5" />
				<span>Businesses</span>
			</top-bar-nav-button>
			<top-bar-nav-button to="game-ledger">
				<icon-ereader class="h-5" />
				<span>Ledger</span>
			</top-bar-nav-button>
		</nav>
		<span class="flex-grow"></span>
		<top-bar-divider />
		<game-button to="logout" size="small">{{ $t('login.logout') }}</game-button>
	</div>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from 'nuxt-property-decorator';
import Profit from '../models/Profit';
import User from '../models/User';
import GameButton from './GameButton.vue';

import MoneyLabel from './MoneyLabel.vue';
import TopBarDate from './TopBarDate.vue';
import TopBarDivider from './TopBarDivider.vue';

import IconDebt from '~/assets/icons/debt.svg?inline';
import IconEreader from '~/assets/icons/ereader.svg?inline';
import IconGroupOfCompanies from '~/assets/icons/group-of-companies.svg?inline';
import IconMoneyBox from '~/assets/icons/money-box.svg?inline';
import IconPlanet from '~/assets/icons/planet.svg?inline';
import IconSortDown from '~/assets/icons/sort-down.svg?inline';
import IconSortUp from '~/assets/icons/sort-up.svg?inline';
import TopBarNavButton from './TopBarNavButton.vue';

@Component({
	name: 'TopBar',
	components: { TopBarNavButton, GameButton, MoneyLabel, TopBarDate, TopBarDivider, IconDebt, IconEreader, IconGroupOfCompanies, IconMoneyBox, IconPlanet, IconSortDown, IconSortUp },
})
export default class TopBar extends Vue {

	@InjectReactive()
	private readonly user: User;

	@InjectReactive()
	private readonly lastProfit: Profit;

}
</script>
