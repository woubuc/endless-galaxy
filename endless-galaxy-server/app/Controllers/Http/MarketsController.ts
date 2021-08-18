import Market from 'App/Models/Market';

export default class MarketsController {
	public async index() {
		return Market.all();
	}
}
