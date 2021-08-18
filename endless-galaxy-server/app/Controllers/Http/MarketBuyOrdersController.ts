import MarketBuyOrder from 'App/Models/MarketBuyOrder';

export default class MarketBuyOrdersController {
	public async index() {
		return MarketBuyOrder.all();
	}
}
