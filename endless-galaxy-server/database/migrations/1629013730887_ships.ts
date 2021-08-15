import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Ships extends BaseSchema {
	protected tableName = 'ships';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');
			table.string('name');

			table.integer('user_id').unsigned().notNullable()
				.references('id').inTable('users');
			table.integer('planet_id').unsigned().notNullable()
				.references('id').inTable('planets');

			table.integer('target_planet_id').unsigned().nullable()
				.references('id').inTable('planets');
			table.integer('target_progress').unsigned().nullable();
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
