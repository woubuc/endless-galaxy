import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm';
import { InventoryStack } from 'App/Models/InventoryStack';
import Market from 'App/Models/Market';
import User from 'App/Models/User';
import { ItemTypeId } from 'App/Services/ItemTypeDataService';
import { DateTime } from 'luxon';

export default class MarketSellOrder extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public userId: number;

	@belongsTo(() => User)
	public readonly user: BelongsTo<typeof User>;

	@column()
	public marketId: number;

	@belongsTo(() => Market)
	public readonly market: BelongsTo<typeof Market>;

	@column()
	public itemType: ItemTypeId;

	@column({ serializeAs: null })
	public stack: InventoryStack;

	@computed()
	public get amount(): number {
		return this.stack.amount;
	}

	@column()
	public price: number;

	@column.dateTime({ autoCreate: true })
	public posted: DateTime;
}
