
export const TYPE_ARRAY_BUFFER = Symbol('TYPE_ARRAY_BUFFER');
export const TYPE_STRING = Symbol('TYPE_STRING');
export const TYPE_NODEJS_BUFFER = Symbol('TYPE_NODEJS_BUFFER');

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

/**
 * Converts file contents to the specified type.
 * @param {ArrayBuffer|DataView|Uint8Array|Buffer|string} source - File contents.
 * @param {symbol} type - Type to convert to.
 * @returns {ArrayBuffer|Buffer|string} -
 */
export function convert(source, type) {
	switch (type) {
		case TYPE_ARRAY_BUFFER:
			if (source instanceof ArrayBuffer) {
				return source;
			}

			if (
				ArrayBuffer.isView(source)
				|| source instanceof Buffer
			) {
				return source.buffer;
			}

			if (typeof source === 'string') {
				return textEncoder.encode(source).buffer;
			}

			throw new Error('Cannot convert file contents to ArrayBuffer.');

		case TYPE_STRING:
			if (typeof source === 'string') {
				return source;
			}

			if (
				source instanceof ArrayBuffer
				|| ArrayBuffer.isView(source)
			) {
				return textDecoder.decode(source);
			}

			if (source instanceof Buffer) {
				return source.toString();
			}

			throw new Error('Cannot convert file contents to string.');

		case TYPE_NODEJS_BUFFER:
			if (source instanceof Buffer) {
				return source;
			}

			if (
				source instanceof ArrayBuffer
				|| ArrayBuffer.isView(source)
				|| typeof source === 'string'
			) {
				return Buffer.from(source);
			}

			throw new Error('Cannot convert file contents to NodeJS Buffer.');
		default:
			throw new Error(`Unknown type "${type}" given.`);
	}
}
