import Deferred from '@woubuc/deferred';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AwaitChangeMixin extends Vue {

	$change<T>(keyPath: string, predicate: (value: T) => boolean) : Promise<void> {
		// @ts-ignore
		let currentValue = this[keyPath];
		if (predicate(currentValue)) {
			return Promise.resolve();
		}

		return new Promise((resolve) => {
			let unwatch = this.$watch(keyPath, function (value) {
				if (predicate(value)) {
					unwatch();
					resolve();
				}
			});
		});
	}
}
