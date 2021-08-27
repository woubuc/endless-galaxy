import Route from '@ioc:Adonis/Core/Route';

Route.get('/', async () => {
	return { hello: 'world' };
});

Route.post('auth/login', 'AuthController.login');
Route.post('auth/logout', 'AuthController.logout');
Route.post('auth/register', 'AuthController.register');
Route.post('auth/verify-email', 'AuthController.verifyEmail');
Route.post('auth/resend-verify-email', 'AuthController.resendVerifyEmail').middleware('auth');

Route.group(() => {
	Route.get('feed', 'FeedController.feed');

	Route.get('user', 'UserController.show');
	Route.patch('user', 'UserController.update');

	Route.get('data', 'DataController.data');
}).middleware('auth');

Route.group(() => {
	Route.get('state', 'GameController.state');

	Route.post('planets/:id/scavenge', 'PlanetsController.scavenge');
	Route.resource('planets', 'PlanetsController').apiOnly();

	Route.resource('mines', 'MinesController').apiOnly();
	Route.resource('factories', 'FactoriesController').apiOnly();

	Route.put('warehouses/:id/auto-traders/:itemTypeId', 'WarehousesController.updateAutoTrader');
	Route.resource('warehouses', 'WarehousesController').apiOnly();

	Route.post('ships/:id/travel', 'ShipsController.travel');
	Route.post('ships/:id/transfer', 'ShipsController.transfer');
	Route.resource('ships', 'ShipsController').apiOnly();

	Route.post('shipyards/:id/order', 'ShipyardsController.order');
	Route.post('shipyards/:id/confirm-order', 'ShipyardsController.confirmOrder');
	Route.resource('shipyards', 'ShipyardsController').apiOnly();

	Route.resource('shipyard-orders', 'ShipyardOrdersController').apiOnly();

	Route.resource('markets', 'MarketsController').apiOnly();

	Route.post('market-buy-orders/:id/sell', 'MarketBuyOrdersController.sell');
	Route.resource('market-buy-orders', 'MarketBuyOrdersController').apiOnly();
	Route.resource('market-sell-orders', 'MarketSellOrdersController').apiOnly();

	Route.get('profits/last', 'ProfitsController.last');
}).middleware(['auth', 'awaitTick', 'requireVerifiedUser']);
