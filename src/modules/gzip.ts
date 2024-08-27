import { type ZlibCompressionOptions } from 'bun';
import { CalpisFile }                  from '../file';

/**
 * Compresses files using gzip.
 * @param options - Options for createGzip method from Bun.gzipSync.
 * @returns -
 */
export default function gzip(options: ZlibCompressionOptions): TransformStream<CalpisFile, CalpisFile> {
	return new TransformStream({
		transform(calpisFile, controller) {
			calpisFile.location.ext += '.gz';

			// eslint-disable-next-line n/no-sync
			calpisFile.contents = Bun.gzipSync(
				calpisFile.contents,
				options,
			).buffer as ArrayBuffer;

			controller.enqueue(calpisFile);
		},
	});
}
