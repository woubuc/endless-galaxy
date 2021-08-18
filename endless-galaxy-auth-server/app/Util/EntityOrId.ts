export type EntityOrId<T extends { id: number }> = T | number | string;

export function getId<T extends { id: number }>(e: EntityOrId<T>): number {
	if (typeof e === 'number') {
		return e;
	}

	if (typeof e === 'string') {
		return parseInt(e, 10);
	}

	return e.id;
}
