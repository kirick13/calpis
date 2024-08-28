import { pipeline }  from './main';
import {
	runTask,
	type CalpisTask,
}                    from './task';
import {
	timing,
	log,
}                    from './utils';

export type CalpisJob = () => Promise<void>;

export const JOB_NAMES = new Map<CalpisJob, string>();

// eslint-disable-next-line jsdoc/require-jsdoc
function wrapJob(fnGiven: CalpisJob): CalpisJob {
	// eslint-disable-next-line jsdoc/require-jsdoc
	async function fn() {
		const fn_name = JOB_NAMES.get(fn) ?? '???';

		log(
			'Started job ',
			{ name: fn_name },
			'...',
		);

		const ts_start = Bun.nanoseconds();

		await fnGiven();

		log(
			'Finished job ',
			{ name: fn_name },
			' in ',
			{ time: timing(ts_start) },
			'.',
		);
	}

	return fn;
}

/**
 * Creates job to run tasks.
 * @param {...any} tasks -
 * @returns -
 */
export function job(...tasks: CalpisTask[]): CalpisJob {
	const task = pipeline(...tasks);

	return wrapJob(async () => {
		const {
			writable,
			readable,
		} = await runTask(task);

		writable.getWriter().close();

		const reader = readable.getReader();

		while (true) {
			// eslint-disable-next-line no-await-in-loop
			const { done } = await reader.read();

			if (done) {
				break;
			}
		}
	});
}

/**
 * Creates job to run jobs in sequence.
 * @param jobs -
 * @returns -
 */
export function sequence(...jobs: CalpisJob[]): CalpisJob {
	return wrapJob(() => {
		let promise = Promise.resolve();

		for (const job_this of jobs) {
			promise = promise.then(job_this);
		}

		return promise;
	});
}

/**
 * Creates job to run jobs in parallel.
 * @param jobs -
 * @returns -
 */
export function parallel(...jobs: CalpisJob[]): CalpisJob {
	return wrapJob(async () => {
		await Promise.all(
			jobs.map(
				(job_this) => job_this(),
			),
		);
	});
}
