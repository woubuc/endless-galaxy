import Shipyard from 'App/Models/Shipyard';

export default class ShipyardsController {

	public async index() {
		return Shipyard.all();
	}
}
