import { type CalpisFile }        from '../file';
import {
	runTask,
	type CalpisTask,
	type CalpisTaskStreamsResult,
}                                 from '../task';

/**
 * Splits stream into streams executing in parallel. All files coming out from these streams will be merged together.
 * @param args - Tasks declarations.
 * @returns -
 */
export default async function split(...args: CalpisTask[]): Promise<CalpisTaskStreamsResult> {
	const promises = [];
	for (const task of args) {
		promises.push(
			runTask(task),
		);
	}

	const result = await Promise.all(promises);
	const writers: WritableStreamDefaultWriter<CalpisFile>[] = [];
	const readers: ReadableStreamDefaultReader<CalpisFile>[] = [];

	for (
		const {
			readable,
			writable,
		} of result
	) {
		writers.push(
			writable.getWriter(),
		);

		readers.push(
			readable.getReader() as ReadableStreamDefaultReader<CalpisFile>,
		);
	}

	// console.log('readers', readers);
	// console.log('writers', writers);

	return {
		writable: new WritableStream<CalpisFile>({
			async write(file) {
				await Promise.all(
					writers.map(
						(writer) => writer.write(
							file.clone(),
						),
					),
				);
			},
			async close() {
				await Promise.all(
					writers.map(
						(writer) => writer.close(),
					),
				);
			},
			async abort(reason) {
				await Promise.all(
					writers.map(
						(writer) => writer.abort(reason),
					),
				);
			},
		}),
		readable: new ReadableStream({
			async start(controller) {
				const read_promises = [];
				for (const reader of readers) {
					read_promises.push(
						attachReaderToController(
							reader,
							controller,
						),
					);
				}

				await Promise.all(read_promises);

				controller.close();
			},
		}),
	};
}

// eslint-disable-next-line jsdoc/require-jsdoc
async function attachReaderToController(
	reader: ReadableStreamDefaultReader,
	controller: Bun.ReadableStreamController<CalpisFile>,
) {
	while (true) {
		const {
			done,
			value,
		// eslint-disable-next-line no-await-in-loop
		} = await reader.read();

		if (done) {
			break;
		}

		controller.enqueue(value);
	}
}
