import { BaseModel, BelongsTo, belongsTo, column, computed, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import { Inventory } from 'App/Models/Inventory';
import Planet from 'App/Models/Planet';
import ShipyardOrder from 'App/Models/ShipyardOrder';

export const SHIPYARD_WORK_SPEED = 10;

export default class Shipyard extends BaseModel {
	public static get(id: number): Promise<Shipyard> {
		return Shipyard.query()
			.withCount('orders')
			.where('id', id)
			.firstOrFail();
	}

	@column({ isPrimary: true })
	public id: number;

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
		return this.orders?.length ?? -1;
	}
}
