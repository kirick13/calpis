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
	let writable: WritableStream<CalpisFile> | null = null;
	let readable: ReadableStream<CalpisFile> | null = null;

	const tasks_promises = [];
	for (const task of args) {
		tasks_promises.push(
			runTask(task),
		);
	}

	const tasks_results = await Promise.all(tasks_promises);

	for (const [ index, task_result ] of tasks_results.entries()) {
		if (task_result.writable instanceof WritableStream) {
			if (index === 0) {
				writable = task_result.writable;
			}
			else if (readable === null) {
				throw new Error('Invalid pipeline: got WritableStream, but there is no ReadableStream to pipe.');
			}
			else if (task_result.readable instanceof ReadableStream) {
				readable.pipeTo(task_result.writable);
			}
			else {
				const [
					readable1,
					readable2,
				]: [
					ReadableStream<CalpisFile>,
					ReadableStream<CalpisFile>,
				] = readable.tee();

				readable1.pipeTo(task_result.writable);

				readable = readable2;
			}
		}

		if (task_result.readable instanceof ReadableStream) {
			readable = task_result.readable;
		}
	}

	return {
		writable,
		readable,
	};
}
