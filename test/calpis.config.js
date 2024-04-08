
import {
    gzip,
	pipeline,
	read,
	use,
    write } from '../src/main.js';

export const html = pipeline(
	read(
		{ base: 'source' },
		'**/*.html',
	),
	// use((calpisFile) => {
	// 	console.log(calpisFile);
	// }),
	write('build'),
	gzip({
		level: 9,
	}),
	write('build'),
);
