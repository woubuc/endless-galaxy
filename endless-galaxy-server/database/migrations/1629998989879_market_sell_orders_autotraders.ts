import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class MarketSellOrdersAutotraders extends BaseSchema {
	protected tableName = 'market_sell_orders';

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.boolean('created_by_auto_trader').notNullable().defaultTo('false');
		});
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn('created_by_auto_trader');
		});
	}
}
