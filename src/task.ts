import { type CalpisFile }   from './file';
import type { MaybePromise } from './types';

export interface CalpisTask {
	module: () => Promise<CalpisTaskModule>;
	args: unknown[];
}
export interface CalpisTaskModule {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	default: (...args: any[]) => MaybePromise<
		ReadableStream<CalpisFile>
		| WritableStream<CalpisFile>
		| TransformStream<CalpisFile, CalpisFile>
		| {
			writable: WritableStream<CalpisFile> | null,
			readable: ReadableStream<CalpisFile> | null,
		}
	>;
}
export interface CalpisTaskResult {
	writable: WritableStream<CalpisFile> | null;
	readable: ReadableStream<CalpisFile> | null;
}

/**
 * Runs a task.
 * @param task -
 * @returns - The writable and readable streams.
 */
export async function runTask(task: CalpisTask): Promise<CalpisTaskResult> {
	const task_module = await task.module();
	const result = await task_module.default(...task.args);

	let writable = null;
	let readable = null;

	if (result instanceof WritableStream) {
		writable = result;
	}
	else if (result instanceof ReadableStream) {
		readable = result;
	}
	else if (
		result instanceof TransformStream
		|| (
			result.writable instanceof WritableStream
			|| result.readable instanceof ReadableStream
		)
	) {
		({
			writable,
			readable,
		} = result);
	}
	else {
		throw new TypeError('Invalid task result.');
	}

	return {
		writable,
		readable,
	};
}
