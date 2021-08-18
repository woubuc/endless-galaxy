import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class MarketSellOrders extends BaseSchema {
	protected tableName = 'market_sell_orders';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');

			table.integer('market_id').unsigned().notNullable()
				.references('id').inTable('markets');

			table.string('item_type').notNullable();
			table.integer('amount').notNullable();
			table.integer('price').notNullable();

			table.timestamp('posted', { useTz: true }).notNullable();
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
