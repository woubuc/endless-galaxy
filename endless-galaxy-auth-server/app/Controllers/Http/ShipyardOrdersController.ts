import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ShipyardOrdersController {

	public async index({ auth }: HttpContextContract) {
		let user = auth.user!;
		await user.load('shipyardOrders', q => q.orderBy('placed'));
		return user.shipyardOrders;
	}

}
