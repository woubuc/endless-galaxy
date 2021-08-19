import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Planet from 'App/Models/Planet';
import ShopItemConfig from 'App/Models/ShopItemConfig';
import { ShopTypeId } from 'App/Models/ShopTypeData';
import User from 'App/Models/User';
import { ItemTypeId } from 'App/Services/ItemTypeDataService';

export default class Shop extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public userId: number;

	@belongsTo(() => User)
	public readonly user: BelongsTo<typeof User>;

	@column()
	public planetId: number;

	@belongsTo(() => Planet)
	public readonly planet: BelongsTo<typeof Planet>;

	@column()
	public shopType: ShopTypeId;

	@column()
	public items: Record<ItemTypeId, ShopItemConfig>;

	@column()
	public size: number;
}

