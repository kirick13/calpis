#!/usr/bin/env bun

import { PATH_ROOT } from './constants.js';
import { timing }    from './utils.js';

console.log(
	timing(),
	PATH_ROOT,
);
