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
| new FactoryWorkingException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class FactoryWorkingException extends Exception {
	public constructor() {
		super('Factory is already working', 422, 'E_FACTORY_WORKING');
	}
}
