
import { CalpisFile } from '../file.js';

/**
 * Invokes a callback function for each file.
 * @param {(CalpisFile) => Promise<any>} callback - Callback function. If returns a CalpisFile object, it will be used as the new file. If returns null, the file will be skipped.
 * @returns {TransformStream<CalpisFile>} -
 */
export default function use(callback) {
	return new TransformStream({
		async transform(file, controller) {
			const result = await callback(file);

			if (result instanceof CalpisFile) {
				controller.enqueue(result);
			}
			else if (result !== null) {
				controller.enqueue(file);
			}
		},
	});
}
