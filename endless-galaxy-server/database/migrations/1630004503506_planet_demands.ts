import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class PlanetDemands extends BaseSchema {
	protected tableName = 'planets';

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.integer('demand_rate').unsigned().notNullable().defaultTo(500);
		});
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn('demand_rate');
		});
	}
}
