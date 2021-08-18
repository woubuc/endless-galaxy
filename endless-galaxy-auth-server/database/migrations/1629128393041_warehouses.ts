import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Warehouses extends BaseSchema {
	protected tableName = 'warehouses';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');

			table.integer('user_id').unsigned().notNullable()
				.references('id').inTable('users');
			table.integer('planet_id').unsigned().notNullable()
				.references('id').inTable('planets');

			table.json('inventory').notNullable();
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
