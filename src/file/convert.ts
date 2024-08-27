export enum ContentTypes {
	ARRAY_BUFFER = 0,
	STRING = 1,
	NODEJS_BUFFER = 2,
}

export type Convertable = ArrayBuffer | DataView | Uint8Array | Buffer | string;

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

/**
 * Converts file contents to the specified type.
 * @param source - File contents.
 * @param type - Type to convert to.
 * @returns -
 */
export function convert(
	source: Convertable,
	type: ContentTypes.ARRAY_BUFFER,
): ArrayBuffer;
/**
 * Converts file contents to the specified type.
 * @param source - File contents.
 * @param type - Type to convert to.
 * @returns -
 */
export function convert(
	source: Convertable,
	type: ContentTypes.STRING,
): string;
/**
 * Converts file contents to the specified type.
 * @param source - File contents.
 * @param type - Type to convert to.
 * @returns -
 */
export function convert(
	source: Convertable,
	type: ContentTypes.NODEJS_BUFFER,
): Buffer;
// eslint-disable-next-line jsdoc/require-jsdoc
export function convert(
	source: Convertable,
	type: ContentTypes,
): ArrayBuffer | Buffer | string {
	switch (type) {
		case ContentTypes.ARRAY_BUFFER:
			if (source instanceof ArrayBuffer) {
				return source;
			}

			if (
				ArrayBuffer.isView(source)
				|| Buffer.isBuffer(source)
			) {
				return source.buffer as ArrayBuffer;
			}

			if (typeof source === 'string') {
				return textEncoder.encode(source).buffer as ArrayBuffer;
			}

			throw new Error('Cannot convert file contents to ArrayBuffer.');

		case ContentTypes.STRING:
			if (typeof source === 'string') {
				return source;
			}

			if (Buffer.isBuffer(source)) {
				return source.toString();
			}

			if (
				source instanceof ArrayBuffer
				|| ArrayBuffer.isView(source)
			) {
				return textDecoder.decode(source as ArrayBuffer);
			}

			throw new Error('Cannot convert file contents to string.');

		case ContentTypes.NODEJS_BUFFER:
			if (source instanceof Buffer) {
				return source;
			}

			if (ArrayBuffer.isView(source)) {
				return Buffer.from(source.buffer);
			}

			if (source instanceof ArrayBuffer) {
				return Buffer.from(source);
			}

			if (typeof source === 'string') {
				return Buffer.from(source);
			}

			throw new Error('Cannot convert file contents to NodeJS Buffer.');

		default:
			throw new Error(`Unknown type "${type}" given.`);
	}
}
