
import { Readable } from 'node:stream';

/**
 * Creates ReadableStream from the given content.
 * @param content - The content to be streamed.
 * @returns - The ReadableStream instance.
 */
export function createReadableStream(content: string | ArrayBuffer | Uint8Array | Buffer): ReadableStream {
	return new ReadableStream({
		start(controller) {
			controller.enqueue(content);
			controller.close();
		},
	});
}

/**
 * Creates Node.js Readable stream from the given content.
 * @param content - The content to be streamed.
 * @returns - The Readable instance.
 */
export function createReadableNodeStream(content: string | Buffer): Readable {
	return new Readable({
		read() {
			this.push(content);
			this.push(null);
		},
	});
}

/**
 * Precise float to a certain number of decimal places.
 * @param number - The number to be precise.
 * @param precision - The number of decimal places.
 * @returns - The precise number.
 */
function preciseFloat(
	number: number,
	precision: number = 2,
): number {
	return Number.parseFloat(
		number.toFixed(precision),
	);
}

/**
 * Converts process's uptime to a human-readable format.
 * @param time_start - The time to start the timing.
 * @returns - The human-readable format of the process's uptime.
 */
export function timing(time_start: number = 0): string {
	const time = Bun.nanoseconds() - time_start;

	if (time < 1_000_000) {
		return `${preciseFloat(time / 1000)} µs`;
	}

	if (time < 1_000_000_000) {
		return `${preciseFloat(time / 1_000_000)} ms`;
	}

	return `${preciseFloat(time / 1_000_000_000)} s`;
}

/**
 * Logs the standard message with the colored arguments.
 * @param args - The arguments to be logged.
 */
export function log(...args: (string | { name: string } | { time: string })[]) {
	console.log(
		'\u001B[0m\u001B[1m\u001B[34m[calpis]\u001B[0m',
		args.map((arg) => {
			if (typeof arg === 'string') {
				return arg;
			}

			if ('name' in arg) {
				return `"\u001B[32m${arg.name}\u001B[0m"`;
			}

			if ('time' in arg) {
				return `\u001B[33m${arg.time}\u001B[0m`;
			}

			return '';
		}).join(''),
	);
}
