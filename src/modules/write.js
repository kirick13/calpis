
/**
 * @typedef {import('./file').CalpisFile} CalpisFile
 */

/**
 * Write file to disk using new base path.
 * @param {string} base_path - Base path.
 * @returns {TransformStream<CalpisFile>} -
 */
export default function write(base_path) {
	return new TransformStream({
		async transform(calpisFile, controller) {
			const calpisFileCopy = calpisFile.clone();
			calpisFileCopy.location.base = base_path;

			await calpisFileCopy.write();

			controller.enqueue(calpisFile);
		},
	});
}
