import { afterDelete, afterSave, BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Market from 'App/Models/Market';
import Shipyard from 'App/Models/Shipyard';
import User from 'App/Models/User';
import FeedService from 'App/Services/FeedService';
import { ItemTypeId } from 'App/Services/ItemTypeDataService';
import { DateTime } from 'luxon';

export type MarketBuyOrderId = number;

export default class MarketBuyOrder extends BaseModel {
	@column({ isPrimary: true })
	public id: MarketBuyOrderId;

	@column()
	public marketId: number;

	@belongsTo(() => Market)
	public market: BelongsTo<typeof Market>;

	@column()
	public userId: number | null;

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>;

	@column()
	public shipyardId: number | null;

	@belongsTo(() => Shipyard)
	public shipyard: BelongsTo<typeof Shipyard>;

	@column()
	public itemType: ItemTypeId;

	@column()
	public amount: number;

	@column({
		prepare: amount => amount.toString(),
		consume: str => parseInt(str, 10),
	})
	public price: number;

	@column.dateTime({ autoCreate: true })
	public posted: DateTime;

	@afterSave()
	public static async afterSave(order: MarketBuyOrder) {
		await FeedService.broadcastMarketBuyOrder(order);
	}

	@afterDelete()
	public static async afterDelete(order: MarketBuyOrder) {
		await FeedService.broadcastDeleteMarketBuyOrder(order);
	}
}
