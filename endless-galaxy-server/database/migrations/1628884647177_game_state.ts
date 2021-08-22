import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class GameState extends BaseSchema {
	protected tableName = 'game_state';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');

			table.integer('minute').unsigned().notNullable();
			table.integer('hour').unsigned().notNullable();
			table.integer('day').unsigned().notNullable();
			table.integer('week').unsigned().notNullable();
			table.integer('month').unsigned().notNullable();
			table.integer('year').unsigned().notNullable();

			table.integer('last_tick').notNullable();
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
