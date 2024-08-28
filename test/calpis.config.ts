/* eslint-disable func-style */
/* eslint-disable no-console */
/* eslint-disable jsdoc/require-jsdoc */

import {
	type CalpisFile,
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

// export const test = pipeline(
// 	read('src/**/*'),
// 	use((file) => {
// 		console.log('[start]', file.location.path);
// 	}),
// 	// conditional(
// 	// 	process.env.CONDITION === '1',
// 	// 	use((file) => {
// 	// 		console.log('[condition] TRUE', file.location.path);
// 	// 	}),
// 	// 	use((file) => {
// 	// 		console.log('[condition] FALSE', file.location.path);
// 	// 	}),
// 	// ),
// 	pipeline(
// 	// parallel(
// 	// isolatedPipeline(
// 		use(async (file) => {
// 			console.log('[step 1] start', file.location.path);

// 			await new Promise((resolve) => {
// 				setTimeout(resolve, 100);
// 			});

// 			console.log('[step 1] end', file.location.path);
// 		}),
// 		use(async (file) => {
// 			console.log('[step 2] start', file.location.path);

// 			await new Promise((resolve) => {
// 				setTimeout(resolve, 100);
// 			});

// 			console.log('[step 2] end', file.location.path);
// 		}),
// 	),
// 	// createTask(() => Promise.resolve({
// 	// 	default() {
// 	// 		return new TransformStream<CalpisFile, CalpisFile>({
// 	// 			transform(file) {
// 	// 				console.log('[transform]', file.location.path);
// 	// 			},
// 	// 		});
// 	// 	},
// 	// }))(),
// 	use((file) => {
// 		console.log('[complete]', file.location.path);
// 	}),
// 	// scss(OPTIONS_SCSS),
// 	// autoprefixer(),
// 	// cleanCss(OPTIONS_CLEANCSS),
// 	// write('work/dist/css'),
// 	// gzip(OPTIONS_GZIP),
// 	// write('work/dist/css'),
// );

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
