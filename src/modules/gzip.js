
/**
 * @typedef {import('./file').CalpisFile} CalpisFile
 */

/**
 * Compresses files using gzip.
 * @param {object} options - Options for createGzip method from node:zlib.
 * @returns {TransformStream<CalpisFile>} -
 */
export default function gzip(options) {
	return new TransformStream({
		transform(calpisFile, controller) {
			calpisFile.location.ext += '.gz';
			calpisFile.contents = Bun.gzipSync(
				calpisFile.contents,
				options,
			);

			controller.enqueue(calpisFile);
		},
	});
}
