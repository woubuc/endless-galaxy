import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm';
import { Inventory } from 'App/Models/Inventory';
import Planet from 'App/Models/Planet';
import ShipyardOrder from 'App/Models/ShipyardOrder';

export default class Shipyard extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public planetId: number;

	@belongsTo(() => Planet)
	public planet: BelongsTo<typeof Planet>;

	@column({ serializeAs: null })
	public inventory: Inventory;

	@column({ serializeAs: null })
	public orders: ShipyardOrder[];

	@computed({ serializeAs: 'order_count' })
	public get orderCount(): number {
		return this.orders.length ?? 0;
	}
}
