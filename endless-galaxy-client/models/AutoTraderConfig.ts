export default interface AutoTraderConfig {
	amount: number;

	sell: boolean;
	sellMode: AutoTraderSellMode;
	sellPrice: number;
	sellAvoidLoss: boolean;

	buy: boolean;
	buyMode: AutoTraderBuyMode;
	buyPrice: number;
}

export const enum AutoTraderSellMode {
	Fixed = 'fixed',
	ProfitMargin = 'profit',
	MarketRate = 'market',
	LowestOnMarket = 'lowest',
}

export const enum AutoTraderBuyMode {
	Fixed = 'fixed',
}
