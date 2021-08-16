import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WarehousesController {
	public async index({ auth }: HttpContextContract) {
		let user = auth.user!;
		await user.load('warehouses');
		return user.warehouses;
	}
}
