#!/usr/bin/env bun

/* eslint-disable no-console */

import nodePath           from 'node:path';
import { PATH_ROOT }      from './constants';
import { timing }         from './utils';
import { type CalpisJob } from './job';

/**
 * Reads the configuration file.
 * @returns -
 */
async function readConfig(): Promise<[string, Record<string, CalpisJob>]> {
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
	// eslint-disable-next-line n/no-process-exit
	process.exit(1);

	throw new Error('Unreachable.');
}

const [
	CONFIG_FILE_NAME,
	CONFIG,
] = await readConfig();

const job_name = process.argv[2] ?? 'default';
const jobFn = CONFIG[job_name];

if (jobFn === undefined) {
	console.error(
		'[calpis]',
		`Job "${job_name}" not found in file ${CONFIG_FILE_NAME}.`,
	);

	// eslint-disable-next-line n/no-process-exit
	process.exit(1);
}

console.log(
	'[calpis]',
	`Initialization complete in ${timing()}.`,
);

const ts_start = Bun.nanoseconds();
console.log(
	'[calpis]',
	`Started job "${job_name}"...`,
);

try {
	await jobFn();
}
catch (error) {
	console.error(error);

	// eslint-disable-next-line n/no-process-exit
	process.exit(1);
}

console.log(
	'[calpis]',
	`Task completed in ${timing(ts_start)}.`,
);

// force process to exit
// eslint-disable-next-line n/no-process-exit
process.exit(0);
