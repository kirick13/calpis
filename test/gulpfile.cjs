
/* eslint-disable jsdoc/require-jsdoc */

// const minifyHtml = require('@minify-html/wasm');
// const { src, dest } = require('gulp');
// const rename = require('gulp-rename');
// const ejs = require('gulp-ejs');

const gulp = require('gulp');
const gzip = require('gulp-gzip');
const minimize = require('gulp-minimize');
const rename = require('gulp-rename');
// const rimraf = require('gulp-rimraf');

console.log(
	'Is Bun?',
	global.Bun ? 'yes' : 'no',
);

// gulp.task(
// 	'clean',
// 	async () => gulp.src(
// 		'build-gulp/**/*',
// 		{
// 			read: false,
// 		},
// 	)
// 		.pipe(
// 			rimraf(),
// 		),
// );

gulp.task(
	'build',
	async () => gulp.src('source/**/*.html')
		.pipe(
			minimize(),
		)
		.pipe(
			rename((path) => {
				path.extname = '.min.html';
			}),
		)
		.pipe(
			gulp.dest('build-gulp')
		)
		.pipe(
			gzip({
				// skipGrowingFiles: true,
				gzipOptions: {
					level: 9,
				},
			})
		)
		.pipe(
			gulp.dest('build-gulp')
		),
);

// gulp.task(
// 	'default',
// 	() => gulp.series(
// 		'clean',
// 		'build',
// 	),
// );
