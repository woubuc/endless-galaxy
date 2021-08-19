import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import { ProfitEntry } from 'App/Models/ProfitEntry';
import User from 'App/Models/User';

export default class Profit extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public week: number;

	@column()
	public userId: number;

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>;

	@column()
	public total: number = 0;

	@column()
	public profitData: Record<string, ProfitEntry[]> = {};

	public addProfitEntry(category: string, key: string, amount: number, meta?: string) {
		this.total += amount;

		if (this.profitData[category] === undefined) {
			this.profitData[category] = [{ key, meta, amounts: [amount] }];
		} else {
			let index = this.profitData[category].findIndex(i => i.key === key && i.meta === meta);
			if (index === -1) {
				this.profitData[category].push({ key, meta, amounts: [amount] });
			} else {
				this.profitData[category][index].amounts.push(amount);
			}
		}
	}
}

