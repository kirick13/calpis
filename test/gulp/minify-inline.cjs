
const CleanCSS = require('clean-css');
const { parse } = require('node-html-parser');
const { minify } = require('terser');
const through = require('through2');

module.exports = function minifyInline(options = {}) {
	const cleanCss = new CleanCSS(options.css ?? {});

	return through.obj(async (file, _, callback) => {
		const element_root = parse(
			file.contents.toString(),
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

		file.contents = Buffer.from(
			element_root.toString(),
		);

		callback(null, file);
	});
};
