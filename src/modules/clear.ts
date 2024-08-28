
import { type CalpisFile } from '../file';

/**
 * Continues the stream, but does not pass any files through.
 * @returns -
 */
export default function clear() {
	return new TransformStream<CalpisFile, CalpisFile>({
		transform() {
			// do nothins
		},
	});
}
