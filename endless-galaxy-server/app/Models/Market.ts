import { BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import MarketBuyOrder from 'App/Models/MarketBuyOrder';
import MarketSellOrder from 'App/Models/MarketSellOrder';
import Planet from 'App/Models/Planet';

export default class Market extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public planetId: number;

	@belongsTo(() => Planet)
	public planet: BelongsTo<typeof Planet>;

	@hasMany(() => MarketBuyOrder)
	public buyOrders: HasMany<typeof MarketBuyOrder>;

	@hasMany(() => MarketSellOrder)
	public sellOrders: HasMany<typeof MarketSellOrder>;
}
