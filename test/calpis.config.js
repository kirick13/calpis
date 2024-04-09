
import {
    gzip,
	pipeline,
	use,
	read,
    write } from '../src/main.js';
import { minifyHtml } from './calpis/declarations.js';

export const build = pipeline(
	read(
		{ base: 'source' },
		'**/*.html',
	),
	minifyHtml(),
	use((calpisFile) => {
		calpisFile.location.ext = '.min.html';
	}),
	write('build-calpis'),
	gzip({
		level: 9,
	}),
	write('build-calpis'),
);
