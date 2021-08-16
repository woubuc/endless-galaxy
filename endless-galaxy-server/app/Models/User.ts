import Hash from '@ioc:Adonis/Core/Hash';
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
}
