
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
