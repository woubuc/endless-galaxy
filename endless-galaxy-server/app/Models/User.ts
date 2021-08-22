import Hash from '@ioc:Adonis/Core/Hash';
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
import {
	afterSave,
	BaseModel,
	beforeSave,
	column,
	computed,
	hasMany,
	HasMany,
	HasManyThrough,
	hasManyThrough,
	manyToMany,
	ManyToMany,
} from '@ioc:Adonis/Lucid/Orm';
import Factory from 'App/Models/Factory';
import Market from 'App/Models/Market';
import Planet from 'App/Models/Planet';
import Profit from 'App/Models/Profit';
import Ship from 'App/Models/Ship';
import Shipyard from 'App/Models/Shipyard';
import ShipyardOrder from 'App/Models/ShipyardOrder';
import Shop from 'App/Models/Shop';
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

	@column({
		prepare: amount => amount.toString(),
		consume: str => parseInt(str, 10),
	})
	public money: number;

	@column({
		prepare: amount => amount.toString(),
		consume: str => parseInt(str, 10),
	})
	public moneyLoaned: number;

	@manyToMany(() => Planet, {
		pivotTable: 'user_discovered_planets',
	})
	public discoveredPlanets: ManyToMany<typeof Planet>;

	@hasManyThrough([() => Shipyard, () => Planet])
	public discoveredShipyards: HasManyThrough<typeof Shipyard>;

	@hasManyThrough([() => Market, () => Planet])
	public discoveredMarkets: HasManyThrough<typeof Market>;

	@hasMany(() => Profit)
	public profitHistory: HasMany<typeof Profit>;

	@hasMany(() => Ship)
	public ships: HasMany<typeof Ship>;

	@hasMany(() => Warehouse)
	public warehouses: HasMany<typeof Warehouse>;

	@hasMany(() => ShipyardOrder)
	public shipyardOrders: HasMany<typeof ShipyardOrder>;

	@hasMany(() => Factory)
	public factories: HasMany<typeof Factory>;

	@hasMany(() => Shop)
	public shops: HasMany<typeof Shop>;

	@beforeSave()
	public static async beforeSave(user: User) {
		if (user.$dirty.password) {
			user.password = await Hash.make(user.password);
		}
	}

	@afterSave()
	public static async afterSave(user: User) {
		await FeedService.emitUser(user);
	}

	public async addProfitEntry(category: string, key: string, amount: number, meta?: string) {
		let fn = async (tx: TransactionClientContract) => {
			let profit = await Profit.query()
				.useTransaction(tx)
				.forUpdate()
				.where({
					user_id: this.id,
					week: GameService.state.week,
				})
				.first();

			if (profit == null) {
				profit = new Profit();
				profit.userId = this.id;
				profit.week = GameService.state.week;
				profit.total = 0;
				profit.profitData = {};
			}

			profit.addProfitEntry(category, key, amount, meta);
			await profit.useTransaction(tx).save();
		};

		if (this.$trx) {
			await fn(this.$trx);
		} else {
			await Database.transaction(fn);
		}
	}
}
