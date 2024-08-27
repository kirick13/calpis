import { config } from '@kirick/eslint-config';

export default [
	...config,
	{
		rules: {
			'no-restricted-exports': 'off',
			'n/hashbang': 'off',
			'n/no-unsupported-features/node-builtins': [
				'error',
				{
					ignores: [
						'ReadableStream',
						'ReadableStreamDefaultReader',
						'TransformStream',
						'WritableStream',
						'WritableStreamDefaultWriter',
					],
				},
			],
		},
	},
];
