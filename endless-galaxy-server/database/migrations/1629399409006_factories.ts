import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Factories extends BaseSchema {
	protected tableName = 'factories';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');

			table.integer('user_id').unsigned().notNullable()
				.references('id').inTable('users');
			table.integer('planet_id').unsigned().notNullable()
				.references('id').inTable('planets');

			table.string('factory_type').notNullable();
			table.string('recipe').nullable();
			table.integer('work_remaining').unsigned().nullable();
			table.integer('size').unsigned().notNullable();
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
