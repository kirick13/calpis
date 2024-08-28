import { type CalpisFile }   from './file';
import type { MaybePromise } from './types';

export interface CalpisTask {
	module: () => Promise<CalpisTaskModule>;
	args: unknown[];
}
export interface CalpisTaskModule {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	default: (...args: any[]) => CalpisTaskResult;
}
export interface CalpisTaskStreamsResult {
	writable: WritableStream<CalpisFile>;
	readable: ReadableStream<CalpisFile>;
}
export type CalpisTaskResult = MaybePromise<
	| TransformStream<CalpisFile, CalpisFile>
	| CalpisTaskStreamsResult
>;

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
 * Runs a task.
 * @param task -
 * @returns - The writable and readable streams.
 */
export async function runTask(task: CalpisTask): Promise<CalpisTaskStreamsResult> {
	const task_module = await task.module();
	const result = await task_module.default(...task.args);

	return {
		writable: result.writable,
		readable: result.readable,
	};
}
