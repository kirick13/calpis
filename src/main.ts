import {
	type CalpisTask,
	createTask,
}                          from './task';

/**
 * Continues the stream, but does not pass any files through.
 * @returns -
 */
export const clear = createTask(() => import('./modules/clear'));

/**
 * Adds condition to the pipeline.
 * @param condition - Condition to check, may be a getter function.
 * @param consequent - Tasks to run if the condition is true.
 * @param alternate - Tasks to run if the condition is false.
 * @returns -
 */
export const conditional = createTask(() => import('./modules/conditional'));

/**
 * Creates pipeline of tasks, but does not output any files.
 * @param tasks - Tasks declarations.
 * @returns -
 */
export function isolatedPipeline(...tasks: CalpisTask[]) {
	return pipeline(
		...tasks,
		clear(),
	);
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
 * Splits stream into streams executing in parallel. All files coming out from these streams will be merged together.
 * @param args - Tasks declarations.
 * @returns -
 */
export const split = createTask(() => import('./modules/split'));

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
export * from './job';
export { createTask } from './task';
