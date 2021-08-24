import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Ship from 'App/Models/Ship';
import User from 'App/Models/User';
import Warehouse from 'App/Models/Warehouse';

export default class ShipPolicy extends BasePolicy {

	public async travel(user: User, ship: Ship): Promise<boolean> {
		return ship.userId === user.id
			&& ship.movementMinutesRemaining == null;
	}

	public async transfer(user: User, [ship, warehouse]: [Ship, Warehouse]): Promise<boolean> {
		return ship.userId === user.id
			&& warehouse.userId === user.id
			&& ship.planetId === warehouse.planetId
			&& ship.movementMinutesRemaining == null;
	}

}
