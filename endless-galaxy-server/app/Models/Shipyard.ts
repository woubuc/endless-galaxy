import { afterSave, BaseModel, BelongsTo, belongsTo, column, computed, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import { Inventory } from 'App/Models/Inventory';
import Planet from 'App/Models/Planet';
import ShipyardOrder from 'App/Models/ShipyardOrder';
import FeedService from 'App/Services/FeedService';

export type ShipyardId = number;

export default class Shipyard extends BaseModel {
	public static get(id: number): Promise<Shipyard> {
		return Shipyard.query()
			.withCount('orders')
			.where('id', id)
			.firstOrFail();
	}

	@column({ isPrimary: true })
	public id: ShipyardId;

	@column()
	public planetId: number;

	@belongsTo(() => Planet)
	public planet: BelongsTo<typeof Planet>;

	@column({ serializeAs: null })
	public inventory: Inventory = {};

	@hasMany(() => ShipyardOrder, { serializeAs: null })
	public orders: HasMany<typeof ShipyardOrder>;

	@computed({ serializeAs: 'orders_count' })
	public get ordersCount(): number {
		return this.$extras?.orders_count ?? this.orders?.length ?? -1;
	}

	@afterSave()
	public static async afterSave(shipyard: Shipyard) {
		await FeedService.broadcastShipyard(shipyard);
	}
}
