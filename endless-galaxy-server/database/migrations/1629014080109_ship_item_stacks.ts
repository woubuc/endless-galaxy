import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class ShipItemStacks extends BaseSchema {
	protected tableName = 'ship_item_stacks';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');
			table.integer('ship_id').unsigned().notNullable()
				.references('id').inTable('ships').onDelete('cascade');

			table.integer('item_id').unsigned().notNullable();
			table.integer('amount').unsigned().notNullable();
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
