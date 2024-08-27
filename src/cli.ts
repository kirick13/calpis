/* eslint-disable no-console */

import nodePath      from 'node:path';
import { PATH_ROOT } from './constants';
import {
	runTask,
	type CalpisTask,
}                    from './task';
import { timing }    from './utils';

/**
 * Reads the configuration file.
 * @returns -
 */
async function readConfig(): Promise<[string, Record<string, CalpisTask>]> {
	for (const filename of [
		'calpis.config.js',
		'calpis.config.cjs',
		'calpis.config.mjs',
		'calpis.config.ts',
	]) {
		try {
			return [
				filename,
				// eslint-disable-next-line no-await-in-loop
				await import(
					nodePath.join(
						PATH_ROOT,
						filename,
					),
				),
			];
		}
		catch {}
	}

	console.error(
		'[calpis]',
		'Configuration file not found.',
	);
	// eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
	process.exit(1);

	throw new Error('Unreachable');
}

const [
	CONFIG_FILE_NAME,
	CONFIG,
] = await readConfig();

const task = process.argv[2] ?? 'default';

if (CONFIG[task] === undefined) {
	console.error(
		'[calpis]',
		`Task "${task}" not found in file ${CONFIG_FILE_NAME}.`,
	);

	// eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
	process.exit(1);
}

console.log(
	'[calpis]',
	`Initialization complete in ${timing()}.`,
);

const ts_start = Bun.nanoseconds();
console.log(
	'[calpis]',
	`Started task "${task}"...`,
);

const { readable } = await runTask(
	CONFIG[task],
);

if (!readable) {
	console.error(
		'[calpis]',
		`Task "${task}" did not return a readable stream.`,
	);

	// eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
	process.exit(1);
}

const error = await new Promise((resolve) => {
	readable.pipeTo(
		new WritableStream({
			close() {
				resolve(undefined);
			},
			abort(stream_error) {
				resolve(stream_error);
			},
		}),
	);
});

console.log(
	'[calpis]',
	`Task completed in ${timing(ts_start)}.`,
);

if (error !== undefined) {
	console.error(error);

	// eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
	process.exit(1);
}

// force process to exit
// eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
process.exit();
