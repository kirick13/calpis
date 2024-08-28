import { pipeline }  from './main';
import {
	runTask,
	type CalpisTask,
}                    from './task';

export type CalpisJob = () => Promise<void>;

/**
 * Creates job to run tasks.
 * @param {...any} tasks -
 * @returns -
 */
export function job(...tasks: CalpisTask[]): CalpisJob {
	const task = pipeline(...tasks);

	return async function () {
		const { readable } = await runTask(task);
		const reader = readable.getReader();

		while (true) {
			// eslint-disable-next-line no-await-in-loop
			const { done } = await reader.read();

			if (done) {
				break;
			}
		}
	};
}

/**
 * Creates job to run jobs in sequence.
 * @param jobs -
 * @returns -
 */
export function sequence(...jobs: CalpisJob[]): CalpisJob {
	return function () {
		let promise = Promise.resolve();

		for (const job_this of jobs) {
			promise = promise.then(job_this);
		}

		return promise;
	};
}

/**
 * Creates job to run jobs in parallel.
 * @param jobs -
 * @returns -
 */
export function parallel(...jobs: CalpisJob[]): CalpisJob {
	return async function () {
		await Promise.all(
			jobs.map(
				(job_this) => job_this(),
			),
		);
	};
}
