import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class GameState extends BaseSchema {
	protected tableName = 'game_state';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');
			table.integer('day').notNullable();
			table.integer('hour').notNullable();
			table.integer('last_tick').notNullable();
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
