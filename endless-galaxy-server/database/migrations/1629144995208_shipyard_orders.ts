import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class ShipyardOrders extends BaseSchema {
	protected tableName = 'shipyard_orders';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');

			table.integer('user_id').unsigned().notNullable()
				.references('id').inTable('users');
			table.integer('shipyard_id').unsigned().notNullable()
				.references('id').inTable('shipyards');

			table.string('ship_type').notNullable();
			table.integer('work_remaining').notNullable();
			table.timestamp('placed', { useTz: true }).notNullable();
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
