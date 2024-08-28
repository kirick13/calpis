import { Glob }                         from 'bun';
import {
	CalpisFile,
	createCalpisFile,
}                                       from '../file';
import { type CalpisTaskStreamsResult } from '../task';

const GLOBS_DEFAULT_NEGATED = [
	new Bun.Glob('!node_modules/**'),
	new Bun.Glob('!**/node_modules/**'),
];

/**
 * Check if a path matches all globs.
 * @param path - The path to check.
 * @param globs - The globs to match.
 * @returns -
 */
function matchAllGlobs(
	path: string,
	globs: Glob[],
): boolean {
	for (const glob of globs) {
		// console.log('match', path, glob.match('./' + path));
		if (glob.match(`./${path}`) !== true) {
			return false;
		}
	}

	return true;
}

export interface ReadOptions {
	base?: string;
	dotfiles?: boolean;
}

/**
 * Reads files using globs.
 * @param globs - Globs to read.
 * @returns -
 */
export default async function read(...globs: string[]): Promise<CalpisTaskStreamsResult>;
/**
 * Reads files using globs.
 * @param options -
 * @param globs - Globs to read.
 * @returns -
 */
export default async function read(options: ReadOptions, ...globs: string[]): Promise<CalpisTaskStreamsResult>;
// eslint-disable-next-line jsdoc/require-jsdoc
export default async function read(...args_given: [ ReadOptions | string, ...string[] ]): Promise<CalpisTaskStreamsResult> {
	let base_path = '.';
	let dotfiles = false;

	const [ arg0, ...args ] = args_given;
	if (typeof arg0 === 'string') {
		args.unshift(arg0);
	}
	else {
		({
			base: base_path = '.',
			dotfiles = false,
		} = arg0);
	}

	const globs = [];
	const globs_negated = [
		...GLOBS_DEFAULT_NEGATED,
	];
	for (const glob_raw of args) {
		const glob = new Bun.Glob(glob_raw);

		if (glob_raw.startsWith('!')) {
			globs_negated.push(glob);
		}
		else {
			globs.push(glob);
		}
	}
	// console.log('globs', globs);
	// console.log('globs_negated', globs_negated);

	const glob_scan_options = {
		cwd: base_path,
		dot: dotfiles,
	};
	// console.log(glob_scan_options);

	const paths = new Set();
	const paths_array: string[] = [];
	for (const glob of globs) {
		// eslint-disable-next-line no-await-in-loop
		for await (const path of glob.scan(glob_scan_options)) {
			if (
				paths.has(path) !== true
				&& matchAllGlobs(path, globs_negated)
			) {
				paths.add(path);
				paths_array.push(path);
			}
		}
	}

	// console.log('base_path', base_path);
	// console.log('paths', paths);

	const {
		promise,
		resolve,
	// eslint-disable-next-line n/no-unsupported-features/es-syntax
	} = Promise.withResolvers<Bun.ReadableStreamController<CalpisFile>>();

	let is_writable_closed = false;
	let is_readable_closed = false;

	const readable = new ReadableStream<CalpisFile>({
		start(controller) {
			resolve(controller);
		},
		async pull(controller) {
			const path = paths_array.shift();

			if (typeof path === 'string') {
				const file = await createCalpisFile(
					base_path,
					path,
				);

				controller.enqueue(file);
			}
			else {
				is_readable_closed = true;

				if (is_writable_closed && is_readable_closed) {
					controller.close();
				}
			}
		},
	});

	const controller = await promise;

	const writable = new WritableStream<CalpisFile>({
		write(file) {
			controller.enqueue(file);
		},
		close() {
			is_writable_closed = true;

			if (is_writable_closed && is_readable_closed) {
				controller.close();
			}
		},
	});

	return {
		writable,
		readable,
	};
}
