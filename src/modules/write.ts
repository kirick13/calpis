
import { type CalpisFile } from '../file';

/**
 * Write file to disk using new base path.
 * @param base_path - Base path.
 * @returns -
 */
export default function write(base_path: string): TransformStream<CalpisFile> {
	return new TransformStream({
		async transform(calpisFile, controller) {
			const calpisFileCopy = calpisFile.clone();
			calpisFileCopy.location.base = base_path;

			await calpisFileCopy.write();

			controller.enqueue(calpisFile);
		},
	});
}
