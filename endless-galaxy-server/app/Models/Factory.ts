import { afterDelete, afterSave, BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm';
import { FactoryTypeId } from 'App/Models/FactoryTypeData';
import Planet from 'App/Models/Planet';
import User from 'App/Models/User';
import FactoryTypeDataService from 'App/Services/FactoryTypeDataService';
import FeedService from 'App/Services/FeedService';

export type FactoryId = number;

export default class Factory extends BaseModel {
	@column({ isPrimary: true })
	public id: FactoryId;

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

	@computed()
	public get staff(): number {
		return FactoryTypeDataService.get(this.factoryType).staff + (this.size - 1);
	}

	@afterSave()
	public static async afterSave(factory: Factory) {
		await FeedService.emitFactory(factory);
	}

	@afterDelete()
	public static async afterDelete(factory: Factory) {
		console.log('factory deleted', factory.id);
		await FeedService.emitFactoryDelete(factory);
	}
}
