import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Shipyards extends BaseSchema {
	protected tableName = 'shipyards';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');

			table.integer('planet_id').unsigned().notNullable()
				.references('id').inTable('planets').onDelete('cascade');

			table.json('inventory').notNullable();
			table.json('reserved_inventory').notNullable();
			table.json('orders').notNullable();
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
