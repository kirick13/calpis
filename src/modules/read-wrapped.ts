import { type CalpisTask }  from '../task';
import type { ReadOptions } from './read';

/**
 * Reads files using globs.
 * @param globs - Globs to read.
 * @returns -
 */
export function read(...globs: string[]): CalpisTask;
/**
 * Reads files using globs.
 * @param options -
 * @param globs - Globs to read.
 * @returns -
 */
export function read(options: ReadOptions, ...globs: string[]): CalpisTask;
// eslint-disable-next-line jsdoc/require-jsdoc
export function read(...args: [ ReadOptions | string, ...string[] ]): CalpisTask {
	return {
		module: () => import('./read'),
		args,
	};
}
