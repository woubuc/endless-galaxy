import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class UserDiscoveredPlanets extends BaseSchema {
	protected tableName = 'user_discovered_planets';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.integer('user_id').unsigned().notNullable()
				.references('id').inTable('users').onDelete('cascade');
			table.integer('planet_id').unsigned().notNullable()
				.references('id').inTable('planets');

			table.primary(['user_id', 'planet_id']);
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
