import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Planets extends BaseSchema {
	protected tableName = 'planets';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');

			table.string('name').notNullable();
			table.integer('x').notNullable();
			table.integer('y').notNullable();
			table.integer('z').notNullable();

			table.integer('population').notNullable().defaultTo(0);

			table.unique(['x', 'y', 'z']);
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
