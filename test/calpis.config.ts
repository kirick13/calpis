/* eslint-disable no-console */
/* eslint-disable jsdoc/require-jsdoc */

import {
	conditional,
	createTask,
	isolatedPipeline,
	job,
	parallel,
	pipeline,
	read,
	sequence,
	split,
	use,
} from '../src/main';

function log(...args: unknown[]) {
	console.log(
		`[${(Bun.nanoseconds() / 1_000_000).toFixed(3)}]`,
		...args,
	);
}

const task_file = use((file) => {
	log('[file]', file.location.path);
});

const task_step1 = use(async (file) => {
	log('[step 1] start', file.location.path);

	await new Promise((resolve) => {
		setTimeout(resolve, 100);
	});

	log('[step 1] end', file.location.path);
});

const task_step2 = use(async (file) => {
	log('[step 2] start', file.location.path);

	await new Promise((resolve) => {
		setTimeout(resolve, 100);
	});

	log('[step 2] end', file.location.path);
});

export const test_txt = job(
	read('src/**/*.txt'),
	task_file,
	task_step1,
	task_step2,
	use((file) => {
		log('[raw]', file.location.path);
	}),
	conditional(
		process.env.COMPRESS === '1',
		split(
			use((file) => {
				log('[gzip]', file.location.path);
				file.location.ext += '.gz';

				return new Promise((resolve) => {
					setTimeout(resolve, 100);
				});
			}),
			use((file) => {
				log('[brotli]', file.location.path);
				file.location.ext += '.br';

				return new Promise((resolve) => {
					setTimeout(resolve, 100);
				});
			}),
		),
	),
	use((file) => {
		log('[result]', file.location.path);
	}),
);

export const test_js = job(
	read('src/**/*.js'),
	task_file,
	task_step1,
	task_step2,
);

export const test_sequence = sequence(
	test_txt,
	test_js,
);

export const test_parallel = parallel(
	test_txt,
	test_js,
);

export const test_multi_reads = job(
	read('src/**/*.js'),
	use(() => new Promise((resolve) => {
		setTimeout(resolve, 100);
	})),
	read('src/**/*.txt'),
	use((file) => {
		log('[result]', file.location.path);
	}),
);
