
import {
	format as formatPath,
	join as joinPath,
	parse as parsePath,
	resolve as resolvePath } from 'node:path';
import { PATH_ROOT }         from '../constants.js';

export class CalpisFileLocation {
	#root = PATH_ROOT;

	#base = null;
	#dir = null;
	#name = null;
	#ext = null;

	constructor(base, path) {
		this.#base = base;

		const {
			dir,
			name,
			ext,
		} = parsePath(path);

		this.#dir = dir;
		this.#name = name;
		this.#ext = ext;
	}

	get root() {
		return this.#root;
	}

	get base() {
		return this.#base;
	}

	set base(value) {
		this.#base = value;
	}

	get dir() {
		return this.#dir;
	}

	set dir(value) {
		this.#dir = value;
	}

	get name() {
		return this.#name;
	}

	set name(value) {
		this.#name = value;
	}

	get ext() {
		return this.#ext;
	}

	set ext(value) {
		if (value.length > 0) {
			const parts = value.split('.').splice(1);

			if (parts.length > 1) {
				this.#ext = '.' + parts.pop();
				this.#name += '.' + parts.join('.');

				return;
			}
		}

		this.#ext = value;
	}

	get path() {
		return formatPath({
			dir: resolvePath(
				this.#root,
				this.#base,
				this.#dir,
			),
			name: this.#name,
			ext: this.#ext,
		});
	}

	get path_relative() {
		return formatPath({
			dir: joinPath(
				this.#base,
				this.#dir,
			),
			name: this.#name,
			ext: this.#ext,
		});
	}
}
