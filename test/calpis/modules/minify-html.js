
/* eslint-disable jsdoc/require-jsdoc */

import Minimize from 'minimize';
import { CalpisFile } from '../../../src/main.js';

// export your module as default
export default function htmlMinify(options) {
	const minimize = new Minimize(options);

	return new TransformStream({
		transform(calpisFile, controller) {
			const content_minified = minimize.parse(
				calpisFile.get(
					CalpisFile.AS_STRING,
				),
			);

			// set new content
			calpisFile.set(content_minified);

			controller.enqueue(calpisFile);
		},
	});
}
