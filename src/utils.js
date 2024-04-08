
import { Readable } from 'node:stream';

/**
 * Creates ReadableStream from the given content.
 * @param {string | ArrayBuffer | Uint8Array | Buffer} content - The content to be streamed.
 * @returns {ReadableStream} - The ReadableStream instance.
 */
export function createReadableStream(content) {
	return new ReadableStream({
		start(controller) {
			controller.enqueue(content);
			controller.close();
		},
	});
}

/**
 * Creates Node.js Readable stream from the given content.
 * @param {string | Buffer} content - The content to be streamed.
 * @returns {Readable} - The Readable instance.
 */
export function createReadableNodeStream(content) {
	return new Readable({
		read() {
			this.push(content);
			this.push(null);
		},
	});
}

/**
 * Precise float to a certain number of decimal places.
 * @param {number} number - The number to be precise.
 * @param {number} precision - The number of decimal places.
 * @returns {number} - The precise number.
 */
function preciseFloat(number, precision = 2) {
	return Number.parseFloat(number.toFixed(precision));
}

/**
 * Converts process's uptime to a human-readable format.
 * @param {number} time_start - The time to start the timing.
 * @returns {string} - The human-readable format of the process's uptime.
 */
export function timing(time_start = 0) {
	const time = Bun.nanoseconds() - time_start;

	if (time < 1_000_000) {
		return `${preciseFloat(time / 1000)} µs`;
	}

	if (time < 1_000_000_000) {
		return `${preciseFloat(time / 1_000_000)} ms`;
	}

	return `${preciseFloat(time / 1_000_000_000)} s`;
}
