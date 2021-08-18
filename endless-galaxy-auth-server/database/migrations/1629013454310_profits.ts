import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Profits extends BaseSchema {
	protected tableName = 'profits';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');

			table.integer('day').unsigned().notNullable();
			table.integer('user_id').unsigned().notNullable()
				.references('id').inTable('users').onDelete('cascade');

			table.integer('total');
			table.json('profit_data');

			table.unique(['day', 'user_id']);
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
