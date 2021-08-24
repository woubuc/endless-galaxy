import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import Env from '@ioc:Adonis/Core/Env';

export default class AppProvider {
	constructor(protected app: ApplicationContract) {
	}

	public register() {
		// Register your own bindings
	}

	public async boot() {
		// IoC container is ready
		if (this.app.environment === 'web') {
			await import('App/Services/ItemTypeDataService').then(s => s.default.load());
			await import('App/Services/RecipeDataService').then(s => s.default.load());
			await import('App/Services/FactoryTypeDataService').then(s => s.default.load());
			await import('App/Services/PlanetTypeDataService').then(s => s.default.load());
			await import('App/Services/ShipTypeDataService').then(s => s.default.load());
			await import('App/Services/ShopTypeDataService').then(s => s.default.load());

			await import('App/Services/GameService').then(s => s.default.load());

			await import('App/Services/TickService').then(s => s.default.start());

			if (Env.get('NODE_ENV') === 'production') {
				const ServerRestart = await import('App/Mailers/ServerRestart');
				await new ServerRestart.default().send();
			}
		}
	}

	public async ready() {
		// App is ready
	}

	public async shutdown() {
		// Cleanup, since app is going down
	}
}
