import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import User from 'App/Models/User';

export default class Profit extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public day: number;

	@column()
	public userId: number;

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>;

	@column()
	public total: number;

	@column()
	public profitData: Record<string, ProfitEntry[]>;
}

export interface ProfitEntry {
	id: string;
	amount: number;
}
