import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class MarketBuyOrders extends BaseSchema {
	protected tableName = 'market_buy_orders';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');

			table.integer('market_id').unsigned().notNullable()
				.references('id').inTable('markets');

			table.integer('user_id').unsigned().nullable()
				.references('id').inTable('users');
			table.integer('shipyard_id').unsigned().nullable()
				.references('id').inTable('shipyards');

			table.string('item_type').notNullable();
			table.integer('amount').notNullable();
			table.bigInteger('price').notNullable();

			table.timestamp('posted', { useTz: true }).notNullable();
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
