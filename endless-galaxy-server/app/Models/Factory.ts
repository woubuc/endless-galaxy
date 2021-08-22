import { afterSave, BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import { FactoryTypeId } from 'App/Models/FactoryTypeData';
import Planet from 'App/Models/Planet';
import User from 'App/Models/User';
import FeedService from 'App/Services/FeedService';

export default class Factory extends BaseModel {
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
	public factoryType: FactoryTypeId;

	@column()
	public size: number;

	@column()
	public recipe: string | null;

	@column()
	public hoursRemaining: number;

	@column()
	public productionCosts: number;

	@column()
	public repeat: boolean;

	@afterSave()
	public static async afterSave(factory: Factory) {
		await FeedService.emitFactory(factory);
	}
}
