import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class WarehouseAutotraders extends BaseSchema {
	protected tableName = 'warehouses';

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.json('auto_trader').notNullable().defaultTo('{}');
		});
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn('auto_trader');
		});
	}
}
