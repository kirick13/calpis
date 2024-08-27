import { type CalpisFile  } from '../file';
import {
	runTask,
	type CalpisTask,
	type CalpisTaskResult,
}                           from '../task';

/**
 * Adds condition to the pipeline.
 * @param condition - Condition to check, may be a getter function.
 * @param consequent - Tasks to run if the condition is true.
 * @param alternate - Tasks to run if the condition is false.
 * @returns -
 */
export default function conditional(
	condition: boolean | (() => boolean),
	consequent: CalpisTask,
	alternate?: CalpisTask,
): CalpisTaskResult {
	const conditionValue = typeof condition === 'function'
		? condition()
		: condition;

	if (Boolean(conditionValue) === true) {
		return runTask(consequent);
	}

	if (alternate !== undefined) {
		return runTask(alternate);
	}

	return {
		readable: null,
		writable: null,
	};
}
