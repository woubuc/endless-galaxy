import { ApplicationContract } from '@ioc:Adonis/Core/Application';

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

		}
	}

	public async ready() {
		// App is ready
	}

	public async shutdown() {
		// Cleanup, since app is going down
	}
}
