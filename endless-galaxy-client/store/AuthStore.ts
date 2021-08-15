import { Module, VuexModule } from 'nuxt-property-decorator';
import { User } from '../models/User';
import { request, RequestError } from '../utils/request';

@Module({
	name: 'AuthStore',
	stateFactory: true,
	namespaced: true,
})
export default class AuthStore extends VuexModule {

	public user: User | null = null;

	public get isAuthenticated(): boolean {
		return this.user !== null;
	}

	public async ensureAuth(): Promise<void> {
		if (this.isAuthenticated) {
			return;
		}

		try {
			this.user = await request('get', 'auth/me');
		} catch (err) {
			if (err instanceof RequestError && err.status == 401) {
				this.user = null;
			} else {
				throw err;
			}
		}
	}
}
