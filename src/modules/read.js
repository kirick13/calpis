
import { createCalpisFile } from '../file.js';

const GLOBS_DEFAULT_NEGATED = [
	new Bun.Glob('!node_modules/**'),
	new Bun.Glob('!**/node_modules/**'),
];

/**
 * Check if a path matches all globs.
 * @param {string} path - The path to check.
 * @param {Bun.Glob[]} globs - The globs to match.
 * @returns {boolean} -
 */
function matchAllGlobs(path, globs) {
	for (const glob of globs) {
		// console.log('match', path, glob.match('./' + path));
		if (glob.match('./' + path) !== true) {
			return false;
		}
	}

	return true;
}

/**
 * Reads files using globs.
 * @overload
 * @param {{ base_path: string|undefined }} options? -
 * @param {...string} globs_raw - Globs to read.
 * @returns {ReadableStream} -
 */
/**
 * Reads files using globs.
 * @overload
 * @param {...string} globs_raw - Globs to read.
 * @returns {ReadableStream} -
 */
export default async function read(...globs_raw) {
	let base_path = '.';
	let dotfiles = false;
	if (globs_raw[0] instanceof Object) {
		({
			base: base_path = '.',
			dotfiles = false,
		} = globs_raw.shift());
	}

	const globs = [];
	const globs_negated = [
		...GLOBS_DEFAULT_NEGATED,
	];
	for (const glob_raw of globs_raw) {
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
	const paths_array = [];
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

	return new ReadableStream({
		async pull(controller) {
			if (paths_array.length === 0) {
				controller.close();
			}
			else {
				const file = await createCalpisFile(
					base_path,
					paths_array.shift(),
				);

				controller.enqueue(file);
			}
		},
	});
}
