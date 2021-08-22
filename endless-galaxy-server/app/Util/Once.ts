export class Once<T> {
	private data?: T;

	public constructor(private readonly fn: () => Promise<T>) {}

	public async get(): Promise<T> {
		if (this.data == undefined) {
			this.data = await this.fn();
		}
		return this.data;
	}

	public async with<U>(fn: (i: T) => U): Promise<U | undefined> {
		if (this.data != undefined) {
			return fn(this.data);
		}
	}
}
