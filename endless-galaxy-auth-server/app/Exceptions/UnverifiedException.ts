import { Exception } from '@adonisjs/core/build/standalone';

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new UnverifiedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class UnverifiedException extends Exception {
	public constructor() {
		super('Your email address is not yet verified', 403, 'E_UNVERIFIED');
	}
}
