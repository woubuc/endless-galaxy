/**
 * Get the current timestamp in seconds (unix epoch)
 */
export function now(): number {
	return Math.floor(Date.now() / 1000);
}

/**
 * Promise wrapper for `setTimeout`
 * @param ms - Time to wait before resolving the promise, in milliseconds
 */
export function wait(ms: number): Promise<void> {
	return new Promise(r => setTimeout(r, ms));
}
