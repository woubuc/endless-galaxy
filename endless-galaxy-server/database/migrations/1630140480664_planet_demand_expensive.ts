import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class PlanetDemandExpensives extends BaseSchema {
	protected tableName = 'planets';

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.boolean('demand_too_expensive').notNullable().defaultTo(false);
		});
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn('demand_too_expensive');
		});
	}
}
