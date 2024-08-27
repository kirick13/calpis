
import { type CalpisFile } from '../file';

/**
 * Write file to disk using new base path.
 * @param base_path - Base path.
 * @returns -
 */
export default function write(base_path: string) {
	return new TransformStream<CalpisFile>({
		async transform(file, controller) {
			const calpisFileCopy = file.clone();
			calpisFileCopy.location.base = base_path;

			await calpisFileCopy.write();

			controller.enqueue(file);
		},
	});
}
