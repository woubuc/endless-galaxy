import { afterDelete, afterSave, BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm';
import { InventoryStack } from 'App/Models/InventoryStack';
import Market from 'App/Models/Market';
import User from 'App/Models/User';
import FeedService from 'App/Services/FeedService';
import { ItemTypeId } from 'App/Services/ItemTypeDataService';
import { DateTime } from 'luxon';

export type MarketSellOrderId = number;

export default class MarketSellOrder extends BaseModel {
	@column({ isPrimary: true })
	public id: MarketSellOrderId;

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

	@column({
		prepare: amount => amount.toString(),
		consume: str => parseInt(str, 10),
	})
	public price: number;

	@column({ serializeAs: null })
	public createdByAutoTrader: boolean = false;

	@column.dateTime({ autoCreate: true })
	public posted: DateTime;

	@afterSave()
	public static async afterSave(order: MarketSellOrder) {
		await FeedService.broadcastMarketSellOrder(order);
	}

	@afterDelete()
	public static async afterDelete(order: MarketSellOrder) {
		await FeedService.broadcastDeleteMarketSellOrder(order);
	}

	public take(amount: number): InventoryStack {
		this.stack.amount -= amount;

		return {
			amount,
			value: this.stack.value,
		};
	}
}
