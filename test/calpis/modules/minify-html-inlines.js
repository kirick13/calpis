
/* eslint-disable jsdoc/require-jsdoc */

import CleanCSS from 'clean-css';
import { parse } from 'node-html-parser';
import { minify } from 'terser';
import { CalpisFile } from '../../../src/main.js';

// export your module as default
export default function htmlMinify(options = {}) {
	const cleanCss = new CleanCSS(options.css ?? {});

	return new TransformStream({
		async transform(calpisFile, controller) {
			const element_root = parse(
				calpisFile.get(
					CalpisFile.AS_STRING,
				),
				{
					script: true,
					style: true,
				},
			);

			for (const element_script of element_root.querySelectorAll('script:not([type]),script[type="text/javascript"]')) {
				let content = '';
				for (const text_node of element_script.childNodes) {
					content += text_node.rawText;
				}

				if (content.length > 0) {
					// eslint-disable-next-line no-await-in-loop
					const result = await minify(content);
					if (result.error) {
						throw result.error;
					}

					content = result.code;

					const [ child_node ] = element_script.childNodes;
					child_node.rawText = content;
					element_script.childNodes = [ child_node ];
				}
			}

			for (const element_script of element_root.querySelectorAll('style')) {
				let content = '';
				for (const text_node of element_script.childNodes) {
					content += text_node.rawText;
				}

				if (content.length > 0) {
					content = cleanCss.minify(content).styles.replaceAll(/\n\s*/g, '');

					const [ child_node ] = element_script.childNodes;
					child_node.rawText = content;
					element_script.childNodes = [ child_node ];
				}
			}

			// set new content
			calpisFile.set(
				element_root.toString(),
			);

			controller.enqueue(calpisFile);
		},
	});
}
