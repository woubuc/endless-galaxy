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
			const TickService = await import('App/Services/GameService');
			await TickService.default.start();

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
