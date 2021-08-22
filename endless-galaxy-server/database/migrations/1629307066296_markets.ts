import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Markets extends BaseSchema {
	protected tableName = 'markets';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');
			table.integer('planet_id').unsigned().notNullable()
				.references('id').inTable('planets');
			table.json('market_rates').notNullable();
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
