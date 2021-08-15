/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';

Route.get('/', async () => {
	return { hello: 'world' };
});

Route.get('auth/me', 'AuthController.me');
Route.post('auth/login', 'AuthController.login');
Route.post('auth/logout', 'AuthController.logout');
Route.post('auth/register', 'AuthController.register');

Route.group(() => {
	Route.get('feed', 'FeedController.feed');
	Route.get('state', 'GameController.state');

	Route.resource('planet', 'PlanetsController').apiOnly();
	Route.resource('ship', 'ShipsController').apiOnly();

	Route.get('profit/last', 'ProfitsController.last');
	Route.resource('profit', 'ProfitsController').apiOnly();
}).middleware('auth').middleware('awaitTick');
