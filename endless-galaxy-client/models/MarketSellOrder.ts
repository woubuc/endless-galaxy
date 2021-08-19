export default interface MarketSellOrder {
	id: number;
	user_id: number;
	market_id: number;

	item_type: string;
	amount: number;
	price: number;

	posted: Date | string;
}
