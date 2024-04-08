#!/usr/bin/env bun

import { join as joinPath } from 'node:path';
import { PATH_ROOT }        from './constants.js';
import { runTask }          from './run-task.js';
import { timing }           from './utils.js';

const config_path = joinPath(
	PATH_ROOT,
	'calpis.config.js',
);

const config = await import(config_path);

const task = process.argv[2] ?? 'default';

if (config[task] === undefined) {
	console.error(
		'[calpis]',
		`Task "${task}" not found in file ${config_path}.`,
	);

	// eslint-disable-next-line no-process-exit
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
	config[task],
);

const error = await new Promise((resolve) => {
	readable.pipeTo(
		new WritableStream({
			close() {
				resolve();
			},
			abort(error) {
				resolve(error);
			},
		}),
	);
});

console.log(
	'[calpis]',
	`Task completed in ${timing(ts_start)}.`,
);

if (error) {
	console.error(error);

	// eslint-disable-next-line no-process-exit
	process.exit(1);
}

// eslint-disable-next-line no-process-exit
process.exit();
