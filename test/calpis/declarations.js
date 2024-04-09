
/* eslint-disable jsdoc/require-jsdoc */

export function minifyHtml(options) {
	return {
		module: () => import('./modules/minify-html.js'),
		args: [ options ],
	};
}

export function minifyHtmlInlines(options) {
	return {
		module: () => import('./modules/minify-html-inlines.js'),
		args: [ options ],
	};
}
