import {
	afterCreate,
	afterDelete,
	afterSave,
	BaseModel,
	BelongsTo,
	belongsTo,
	column,
	computed,
} from '@ioc:Adonis/Lucid/Orm';
import Shipyard from 'App/Models/Shipyard';
import User from 'App/Models/User';
import FeedService from 'App/Services/FeedService';
import ShipTypeService from 'App/Services/ShipTypeDataService';
import { DateTime } from 'luxon';

export default class ShipyardOrder extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public userId: number;

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>;

	@column()
	public shipyardId: number;

	@belongsTo(() => Shipyard)
	public shipyard: BelongsTo<typeof Shipyard>;

	@column()
	public shipType: string;

	@column()
	public workRemaining: number;

	@computed({ serializeAs: 'total_work' })
	public get totalWork(): number {
		return ShipTypeService.get(this.shipType).totalResources;
	}

	@column.dateTime()
	public placed: DateTime;

	@afterCreate()
	public static async afterCreate(order: ShipyardOrder) {
		await order.load('shipyard', q => q.withCount('orders'));
		await FeedService.broadcastShipyard(order.shipyard);
	}

	@afterSave()
	public static async afterSave(order: ShipyardOrder) {
		await FeedService.emitShipyardOrder(order);
	}

	@afterDelete()
	public static async afterDelete(order: ShipyardOrder) {
		await FeedService.emitDeleteShipyardOrder(order);

		let shipyard = await Shipyard.query()
			.where('id', order.shipyardId)
			.withCount('orders')
			.firstOrFail();
		await FeedService.broadcastShipyard(shipyard);
	}
}
