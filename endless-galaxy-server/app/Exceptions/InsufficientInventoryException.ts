import { Exception } from '@adonisjs/core/build/standalone'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new InsufficientInventoryException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class InsufficientInventoryException extends Exception {
	public constructor() {
		super('Not enough items in inventory', 422, 'E_INSUFFICIENT_INVENTORY');
	}
}
