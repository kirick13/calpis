import { CalpisFile }        from '../file';
import type { MaybePromise } from '../types';

/**
 * Invokes a callback function for each file.
 * @param callback - Callback function. If returns a CalpisFile object, it will be used as the new file. If returns null, the file will be skipped.
 * @returns -
 */
export default function use(callback: (file: CalpisFile) => MaybePromise<CalpisFile | null | void>): TransformStream<CalpisFile> {
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
