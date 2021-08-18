export default interface MarketBuyOrder {
	id: number;
	market_id: number;

	item_type: string;
	amount: number;
	price: number;

	posted: Date | string;
}
