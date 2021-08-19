import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Market from 'App/Models/Market';
import { ItemTypeId } from 'App/Services/ItemTypeDataService';
import { DateTime } from 'luxon';

export default class MarketBuyOrder extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public marketId: number;

	@belongsTo(() => Market)
	public market: BelongsTo<typeof Market>;

	@column()
	public itemType: ItemTypeId;

	@column()
	public amount: number;

	@column()
	public price: number;

	@column.dateTime({ autoCreate: true })
	public posted: DateTime;
}
