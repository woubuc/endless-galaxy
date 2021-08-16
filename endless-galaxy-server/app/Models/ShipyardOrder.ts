import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Shipyard from 'App/Models/Shipyard';
import User from 'App/Models/User';
import { ItemTypeId } from 'App/Services/ItemTypeService';

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
	public budgetRemaining: number;

	@column()
	public resourcesRemaining: Record<ItemTypeId, number>;
}
