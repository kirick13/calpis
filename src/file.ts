
import { mkdir }              from 'node:fs/promises';
import nodePath               from 'node:path';
import {
	convert,
	ContentTypes,
	type Convertable,
}                             from './file/convert';
import { CalpisFileLocation } from './file/location';

export class CalpisFile {
	location: CalpisFileLocation;
	contents: ArrayBuffer;

	constructor(
		base_path: string,
		path: string,
		contents: ArrayBuffer,
	) {
		this.location = new CalpisFileLocation(base_path, path);
		this.contents = contents;
	}

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * File contents as an ArrayBuffer.
	 */
	get arrayBuffer() {
		return this.contents;
	}

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * File contents as a string.
	 */
	get text() {
		return convert(
			this.contents,
			ContentTypes.STRING,
		);
	}

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * File contents as a Node.js Buffer.
	 */
	get buffer() {
		return convert(
			this.contents,
			ContentTypes.NODEJS_BUFFER,
		);
	}

	/**
	 * Sets file contents.
	 * @param source -
	 */
	set(source: Convertable) {
		this.contents = convert(
			source,
			ContentTypes.ARRAY_BUFFER,
		);
	}

	/**
	 * Writes file to disk.
	 */
	async write() {
		await mkdir(
			nodePath.dirname(this.location.path),
			{
				recursive: true,
			},
		);

		await Bun.write(
			this.location.path,
			this.contents,
		);
	}

	/**
	 * Clones the file.
	 * @returns -
	 */
	clone(): CalpisFile {
		return new CalpisFile(
			this.location.base,
			this.location.path_base_relative,
			this.contents,
		);
	}
}

/**
 * Creates new CalpisFile object from a file path.
 * @param base_path - Base path.
 * @param path - File path.
 * @returns -
 */
export async function createCalpisFile(
	base_path: string,
	path: string,
): Promise<CalpisFile> {
	const file = Bun.file(
		nodePath.join(
			base_path,
			path,
		),
	);
	const contents = await file.arrayBuffer();

	const calpisFile = new CalpisFile(
		base_path,
		path,
		contents,
	);

	return calpisFile;
}
