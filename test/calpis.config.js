
import {
    gzip,
	pipeline,
	use,
	read,
    write } from '../src/main.js';
import { minifyHtml } from './calpis/declarations.js';

export const build = pipeline(
	read(
		{
			base: 'source',
			dotfiles: true,
		},
		'**/*.html',
		'!**/_*.html',
		'!**/*.org.html',
	),
	// use((file) => console.log(file.location.path)),
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
