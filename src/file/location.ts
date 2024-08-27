import nodePath      from 'node:path';
import { PATH_ROOT } from '../constants';

export class CalpisFileLocation {
	#root: string = PATH_ROOT;
	#base: string;
	#dir: string;
	#name: string;
	#ext: string;

	constructor(
		base: string,
		path: string,
	) {
		this.#base = base;

		const {
			dir,
			name,
			ext,
		} = nodePath.parse(path);

		this.#dir = dir;
		this.#name = name;
		this.#ext = ext;
	}

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * Current working directory. Cannot be changed.
	 */
	get root() {
		return this.#root;
	}

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * Base path. Useful to move files from one location to another.
	 */
	get base() {
		return this.#base;
	}

	set base(value) {
		this.#base = value;
	}

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * Directory in which the file is located.
	 */
	get dir() {
		return this.#dir;
	}

	set dir(value) {
		this.#dir = value;
	}

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * File name without an extension.
	 */
	get name() {
		return this.#name;
	}

	set name(value) {
		this.#name = value;
	}

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * File extension including the dot.
	 */
	get ext() {
		return this.#ext;
	}

	set ext(value) {
		if (value.length > 0) {
			const parts = value.split('.').splice(1);

			if (parts.length > 1) {
				this.#ext = `.${parts.pop()}`;
				this.#name += `.${parts.join('.')}`;

				return;
			}
		}

		this.#ext = value;
	}

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * Full path to the file including the root path.
	 */
	get path_full() {
		return nodePath.format({
			dir: nodePath.resolve(
				this.#root,
				this.#base,
				this.#dir,
			),
			name: this.#name,
			ext: this.#ext,
		});
	}

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * Path to the file relative to the root path.
	 */
	get path() {
		return nodePath.format({
			dir: nodePath.join(
				this.#base,
				this.#dir,
			),
			name: this.#name,
			ext: this.#ext,
		});
	}

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * Path to the file relative to the base path.
	 */
	get path_base_relative() {
		return nodePath.format({
			dir: this.#dir,
			name: this.#name,
			ext: this.#ext,
		});
	}
}
