import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Ships extends BaseSchema {
	protected tableName = 'ships';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');
			table.string('name').nullable();
			table.string('ship_type').notNullable();

			table.integer('user_id').unsigned().notNullable()
				.references('id').inTable('users');
			table.integer('planet_id').unsigned().notNullable()
				.references('id').inTable('planets');

			table.integer('movement_distance').unsigned().nullable();
			table.integer('movement_distance_remaining').unsigned().nullable();

			table.json('inventory').notNullable();
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
