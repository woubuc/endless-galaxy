import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Shops extends BaseSchema {
	protected tableName = 'shops';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');

			table.integer('user_id').unsigned().notNullable()
				.references('id').inTable('users');
			table.integer('planet_id').unsigned().notNullable()
				.references('id').inTable('planets');

			table.string('shop_type').notNullable();
			table.json('items').notNullable();
			table.integer('size').unsigned().notNullable();
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
