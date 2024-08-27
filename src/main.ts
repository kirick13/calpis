import {
	type CalpisTask,
	type CalpisTaskModule,
} from './task';

/**
 * Creates a task from a module.
 * Useful for TypeScript type inference, but cannot be used with functions with overloads.
 * @param module - Getter of a module to create task from.
 * @returns -
 */
export function createTask<const M extends CalpisTaskModule, const A extends unknown[] = Parameters<M['default']>>(module: () => Promise<M>): (...args: A) => CalpisTask {
	return (...args: A) => {
		return {
			module,
			args,
		};
	};
}

/**
 * Compresses files using gzip.
 * @param options - Options for `Bun.gzipSync` method.
 * @returns -
 */
export const gzip = createTask(() => import('./modules/gzip'));

/**
 * Creates pipeline of tasks.
 * @param tasks - Tasks declarations.
 * @returns -
 */
export const pipeline = createTask(() => import('./modules/pipeline'));

export { read } from './modules/read-wrapped';

/**
 * Invokes a callback function for each file.
 * @param callback - Callback function. If returns a `CalpisFile`, it will replace received file. If returns `null`, the received file will not be passed to the next task.
 * @returns -
 */
export const use = createTask(() => import('./modules/use'));

/**
 * Write file to disk using new base path.
 * @param base_path - Base path.
 * @returns -
 */
export const write = createTask(() => import('./modules/write'));

export { CalpisFile } from './file';
