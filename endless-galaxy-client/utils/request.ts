export async function request<T>(
	method: 'get' | 'post' | 'put' | 'patch' | 'delete',
	endpoint: string,
	init: Partial<RequestInit & { json: boolean, body: BodyInit | Record<string, any> }> = {},
): Promise<T> {
	if (endpoint.startsWith('/')) {
		endpoint = endpoint.slice(1);
	}
	let url = `${ process.env.SERVER_BASE_URL }/${ endpoint }`;

	let headers = new Headers(init.headers);
	if (init.json) {
		headers.set('Content-Type', 'application/json');

		if (typeof init.body == 'object') {
			init.body = JSON.stringify(init.body);
		}
	}

	let response = await fetch(url, {
		...init,
		headers,
		method: method.toUpperCase(),
		credentials: 'include',
	});

	if (response.status === 204) {
		return {} as any;
	}

	let body: any = await response.text();
	if (body.length > 0) {
		body = JSON.parse(body);
	}

	if (response.status < 200 || response.status > 299) {
		throw new RequestError(response.status, body);
	}

	return body;
}

export class RequestError extends Error {
	public constructor(
		public readonly status: number,
		public readonly body: Record<string, any>,
	) {
		super();
	}

	public hasError(rule: string): boolean {
		if (!this.body.errors || !Array.isArray(this.body.errors)) {
			return false;
		}

		for (let error of this.body.errors) {
			if (error.rule === rule) {
				return true;
			}
		}

		return false;
	}
}
