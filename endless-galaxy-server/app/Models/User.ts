import Hash from '@ioc:Adonis/Core/Hash';
import Database from '@ioc:Adonis/Lucid/Database';
import {
	BaseModel,
	beforeSave,
	column,
	computed,
	hasMany,
	HasMany, HasManyThrough, hasManyThrough,
	manyToMany,
	ManyToMany,
} from '@ioc:Adonis/Lucid/Orm';
import Planet from 'App/Models/Planet';
import Profit from 'App/Models/Profit';
import Ship from 'App/Models/Ship';
import Shipyard from 'App/Models/Shipyard';
import ShipyardOrder from 'App/Models/ShipyardOrder';
import Warehouse from 'App/Models/Warehouse';
import FeedService from 'App/Services/FeedService';
import GameService from 'App/Services/GameService';
import { DateTime } from 'luxon';

export type UserId = number;

export default class User extends BaseModel {
	@column({ isPrimary: true })
	public id: UserId;

	@column()
	public email: string;

	@column({ serializeAs: null })
	public password: string;

	@column({ serializeAs: null })
	public rememberMeToken?: string;

	@column({ serializeAs: null })
	public emailVerifyToken: string | null;

	@column.dateTime()
	public emailVerifySent: DateTime | null;

	@computed({ serializeAs: 'email_verified' })
	public get emailVerified(): boolean {
		return this.emailVerifyToken == null;
	}

	@column()
	public companyName?: string;

	@column()
	public money: number;

	@column()
	public moneyLoaned: number;

	@manyToMany(() => Planet, {
		pivotTable: 'user_discovered_planets',
	})
	public discoveredPlanets: ManyToMany<typeof Planet>;

	@hasManyThrough([() => Shipyard, () => Planet])
	public discoveredShipyards: HasManyThrough<typeof Shipyard>;

	@hasMany(() => Profit)
	public profitHistory: HasMany<typeof Profit>;

	@hasMany(() => Ship)
	public ships: HasMany<typeof Ship>;

	@hasMany(() => Warehouse)
	public warehouses: HasMany<typeof Warehouse>;

	@hasMany(() => ShipyardOrder)
	public shipyardOrders: HasMany<typeof ShipyardOrder>;

	@beforeSave()
	public static async hashPassword(user: User) {
		if (user.$dirty.password) {
			user.password = await Hash.make(user.password);
		}
	}

	public async addProfitEntry(category: string, key: string, amount: number, meta?: string) {
		await Database.transaction(async (tx) => {
			let profit = await Profit.query()
				.useTransaction(tx)
				.forUpdate()
				.where({
					user_id: this.id,
					day: GameService.day,
				})
				.first();

			if (profit == null) {
				profit = new Profit();
				profit.userId = this.id;
				profit.day = GameService.day;
				profit.total = 0;
				profit.profitData = {};
			}

			profit.addProfitEntry(category, key, amount, meta);
			await profit.useTransaction(tx).save();
			await FeedService.emitProfit(this, profit);
		})
	}
}
