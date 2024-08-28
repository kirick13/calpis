import { type CalpisFile }        from '../file';
import {
	runTask,
	type CalpisTask,
	type CalpisTaskStreamsResult,
}                                 from '../task';

/**
 * Creates pipeline of tasks.
 * @param args - Tasks declarations.
 * @returns -
 */
export default async function pipeline(...args: CalpisTask[]): Promise<CalpisTaskStreamsResult> {
	if (args.length === 0) {
		return new TransformStream<CalpisFile>();
	}

	let writable: WritableStream<CalpisFile>;
	let readable: ReadableStream<CalpisFile>;

	const tasks_promises = [];
	for (const task of args) {
		tasks_promises.push(
			runTask(task),
		);
	}

	const tasks_results = await Promise.all(tasks_promises);

	for (const [ index, task_result ] of tasks_results.entries()) {
		if (index === 0) {
			writable = task_result.writable;
		}
		else {
			readable!.pipeTo(task_result.writable);
		}

		readable = task_result.readable;
	}

	// stupid TypeScript hack
	if (!writable! || !readable!) {
		throw new Error('Unreachable.');
	}

	return {
		writable,
		readable,
	};
}
