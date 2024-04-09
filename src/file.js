
import { mkdir }              from 'node:fs/promises';
import { dirname }            from 'node:path';
import {
	TYPE_ARRAY_BUFFER,
	TYPE_STRING,
	TYPE_NODEJS_BUFFER,
	convert }                 from './file/convert.js';
import { CalpisFileLocation } from './file/location.js';

export class CalpisFile {
	static AS_ARRAY_BUFFER = TYPE_ARRAY_BUFFER;
	static AS_STRING = TYPE_STRING;
	static AS_NODEJS_BUFFER = TYPE_NODEJS_BUFFER;

	location;
	contents;

	constructor(base_path, path) {
		this.location = new CalpisFileLocation(base_path, path);
	}

	get(type) {
		return convert(
			this.contents,
			type,
		);
	}

	set(source) {
		this.contents = convert(
			source,
			TYPE_ARRAY_BUFFER,
		);
	}

	async write() {
		await mkdir(
			dirname(this.location.path),
			{
				recursive: true,
			},
		);

		await Bun.write(
			this.location.path,
			this.contents,
		);
	}

	clone() {
		const calpisFileClone = new CalpisFile(
			this.location.root,
			'',
			// PROTECTOR,
		);

		calpisFileClone.location.dir = this.location.dir;
		calpisFileClone.location.name = this.location.name;
		calpisFileClone.location.ext = this.location.ext;

		calpisFileClone.contents = this.contents;

		return calpisFileClone;
	}
}

/**
 * Creates new CalpisFile object from a file path.
 * @param {string} base_path - Base path.
 * @param {string} path - File path.
 * @returns {Promise<CalpisFile>} -
 */
export async function createCalpisFile(base_path, path) {
	const calpisFile = new CalpisFile(
		base_path,
		path,
		// PROTECTOR,
	);

	const file = Bun.file(calpisFile.location.path);
	calpisFile.contents = await file.arrayBuffer();

	return calpisFile;
}
