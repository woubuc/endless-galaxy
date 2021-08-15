import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class UsersSchema extends BaseSchema {
	protected tableName = 'users';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').primary();

			table.string('email').notNullable().unique();
			table.string('password', 180).notNullable();
			table.string('remember_me_token').nullable();

			table.string('company_name', 255).nullable();
			table.integer('money').notNullable();
			table.integer('money_loaned').notNullable()
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
