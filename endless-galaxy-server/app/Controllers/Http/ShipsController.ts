import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import { GAME_MINUTES_PER_TICK } from 'App/Constants';
import Planet from 'App/Models/Planet';
import Ship from 'App/Models/Ship';
import Warehouse from 'App/Models/Warehouse';
import ItemTypeDataService from 'App/Services/ItemTypeDataService';
import ShipTypeDataService from 'App/Services/ShipTypeDataService';
import { transfer, volumeOf } from 'App/Util/InventoryUtils';
import { clamp } from 'App/Util/NumberUtils';
import ShipTransferValidator from 'App/Validators/ShipTransferValidator';
import ShipTravelValidator from 'App/Validators/ShipTravelValidator';

export default class ShipsController {

	public async index({ auth }: HttpContextContract) {
		let user = auth.user!;
		await user.load('ships');
		return user.ships;
	}

	public async travel({ bouncer, request }: HttpContextContract) {
		let shipId = parseInt(request.param('id'), 10);
		let { planetId } = await request.validate(ShipTravelValidator);

		return Database.transaction(async (tx) => {
			let ship = await Ship.query()
				.useTransaction(tx)
				.forUpdate()
				.preload('planet')
				.where('id', shipId)
				.firstOrFail();

			await bouncer.with('Ship').authorize('travel', ship);

			let shipType = ShipTypeDataService.get(ship.shipType);

			let targetPlanet = await Planet.findOrFail(planetId);

			let distance = Math.sqrt(
				Math.pow(targetPlanet.x - ship.planet.x, 2)
				+ Math.pow(targetPlanet.y - ship.planet.y, 2)
				+ Math.pow(targetPlanet.z - ship.planet.z, 2)
			);
			let minutes = Math.round(distance * 60 / shipType.speed / GAME_MINUTES_PER_TICK) * GAME_MINUTES_PER_TICK;

			ship.planetId = planetId;
			ship.movementMinutes = minutes;
			ship.movementMinutesRemaining = minutes;
			await ship.useTransaction(tx).save();
		});
	}

	public async transfer({ bouncer, request }: HttpContextContract) {
		let shipId = parseInt(request.param('id'), 10);
		let { itemTypeId, amount, to } = await request.validate(ShipTransferValidator);

		return Database.transaction(async (tx) => {
			let ship = await Ship.query()
				.useTransaction(tx)
				.forUpdate()
				.preload('planet')
				.where('id', shipId)
				.firstOrFail();

			let warehouse = await Warehouse.query()
				.useTransaction(tx)
				.forUpdate()
				.where( {
					user_id: ship.userId,
					planet_id: ship.planetId,
				})
				.firstOrFail();

			await bouncer.with('Ship').authorize('transfer', [ship, warehouse]);

			let shipType = ShipTypeDataService.get(ship.shipType);
			let itemType = ItemTypeDataService.get(itemTypeId);

			if (to === 'ship') {
				let remainingCapacity = shipType.capacity - volumeOf(ship.inventory);
				let maxItems = clamp(Math.floor(remainingCapacity / itemType.volume), 0, Infinity);

				amount = clamp(amount, 0, maxItems);

				transfer(warehouse.inventory, ship.inventory, { [itemTypeId]: amount });
			} else {
				let remainingCapacity = warehouse.capacity - volumeOf(warehouse.inventory);
				let maxItems = clamp(Math.floor(remainingCapacity / itemType.volume), 0, Infinity);

				amount = clamp(amount, 0, maxItems);

				transfer(ship.inventory, warehouse.inventory, { [itemTypeId]: amount });
			}

			await ship.useTransaction(tx).save();
			await warehouse.useTransaction(tx).save();
		});
	}
}
