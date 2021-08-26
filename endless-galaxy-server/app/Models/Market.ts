import { BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import MarketBuyOrder from 'App/Models/MarketBuyOrder';
import MarketSellOrder from 'App/Models/MarketSellOrder';
import Planet from 'App/Models/Planet';
import { ItemTypeId } from 'App/Services/ItemTypeDataService';

export type MarketId = number;

export default class Market extends BaseModel {
	@column({ isPrimary: true })
	public id: MarketId;

	@column()
	public planetId: number;

	@belongsTo(() => Planet)
	public planet: BelongsTo<typeof Planet>;

	@column()
	public marketRates: Record<ItemTypeId, number>;

	@hasMany(() => MarketBuyOrder)
	public buyOrders: HasMany<typeof MarketBuyOrder>;

	@hasMany(() => MarketSellOrder)
	public sellOrders: HasMany<typeof MarketSellOrder>;

	public getMarketRate(itemId: ItemTypeId): number {
		if (this.marketRates[itemId] == undefined) {
			return 100_00;
		} else {
			return this.marketRates[itemId];
		}
	}

	public updateMarketRate(id: ItemTypeId, price: number) {
		if (this.marketRates[id] == undefined) {
			this.marketRates[id] = price;
		} else {
			this.marketRates[id] = Math.round((this.marketRates[id] + price) / 2);
		}
	}
}
