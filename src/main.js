
/**
 * @typedef {import('./types').CalpisFile} CalpisFile
 * @typedef {import('./run-task').CalpisTask} CalpisTask
 */

/**
 * Compresses files using gzip.
 * @param {object} options - Options for createGzip method from node:zlib.
 * @returns {CalpisTask} -
 */
export function gzip(options) {
	return {
		module: () => import('./modules/gzip.js'),
		args: [
			options,
		],
	};
}

/**
 * Creates pipeline of tasks.
 * @param {...CalpisTask} tasks - Tasks declarations.
 * @returns {CalpisTask} -
 */
export function pipeline(...tasks) {
	return {
		module: () => import('./modules/pipeline.js'),
		args: tasks,
	};
}

/**
 * Reads files using globs.
 * @overload
 * @param {{ base_path: string|undefined }} options? -
 * @param {...string} args - Globs to read.
 * @returns {CalpisTask} -
 */
/**
 * Reads files using globs.
 * @overload
 * @param {...string} args - Globs to read.
 * @returns {CalpisTask} -
 */
export function read(...args) {
	return {
		module: () => import('./modules/read.js'),
		args,
	};
}

/**
 * Invokes a callback function for each file.
 * @param {(CalpisFile) => Promise<any>} callback - Callback function. If returns a CalpisFile object, it will be used as the new file. If returns null, the file will be skipped.
 * @returns {CalpisTask} -
 */
export function use(callback) {
	return {
		module: () => import('./modules/use.js'),
		args: [
			callback,
		],
	};
}

/**
 * Write file to disk using new base path.
 * @param {string} base_path - Base path.
 * @returns {CalpisTask} -
 */
export function write(base_path) {
	return {
		module: () => import('./modules/write.js'),
		args: [
			base_path,
		],
	};
}

export { CalpisFile } from './file.js';
