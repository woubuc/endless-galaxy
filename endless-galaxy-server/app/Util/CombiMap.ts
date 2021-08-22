type KeyPrimitive = string | number;
type Key = KeyPrimitive | KeyPrimitive[];

export default class CombiMap<K extends Key, V> {
	public static from<K extends Key, V>(items: V[], idFn: (i: V) => K): CombiMap<K, V> {
		let map = new CombiMap<K, V>();
		for (let item of items) {
			map.set(idFn(item), item);
		}
		return map;
	}

	private map = new Map<string, V>();
	private newItems: V[] = [];

	private createKey(key: K): string {
		if (Array.isArray(key)) {
			return key.join('_');
		}
		return key.toString();
	}

	public set(key: K, value: V): void {
		this.map.set(this.createKey(key), value);
	}

	public get(key: K): V | undefined {
		return this.map.get(this.createKey(key));
	}

	public add(item: V): void {
		this.newItems.push(item);
	}

	public *values(): IterableIterator<V> {
		for (let item of this.map.values()) {
			yield item;
		}

		for (let item of this.newItems) {
			yield item;
		}
	}

	public *lookup(predicate: (i: V) => boolean): IterableIterator<V> {
		for (let item of this.values()) {
			if (predicate(item)) {
				yield item;
			}
		}
	}
}
