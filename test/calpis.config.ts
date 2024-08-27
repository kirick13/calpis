
import {
	conditional,
	parallel,
	pipeline,
	read,
	use,
} from '../src/main';

export const test = pipeline(
	read('src/**/*'),
	// conditional(
	// 	process.env.CONDITION === '1',
	// 	use((file) => {
	// 		console.log('[condition] TRUE', file.location.path);
	// 	}),
	// 	use((file) => {
	// 		console.log('[condition] FALSE', file.location.path);
	// 	}),
	// ),
	// pipeline(
	parallel(
		use(async (file) => {
			console.log('[step 1] start', file.location.path);

			await new Promise((resolve) => {
				setTimeout(resolve, 500);
			});

			console.log('[step 1] end', file.location.path);
		}),
		use(async (file) => {
			console.log('[step 2] start', file.location.path);

			await new Promise((resolve) => {
				setTimeout(resolve, 500);
			});

			console.log('[step 2] end', file.location.path);
		}),
	),
	use((file) => {
		console.log('[complete]', file.location.path);
	}),
	// scss(OPTIONS_SCSS),
	// autoprefixer(),
	// cleanCss(OPTIONS_CLEANCSS),
	// write('work/dist/css'),
	// gzip(OPTIONS_GZIP),
	// write('work/dist/css'),
);
