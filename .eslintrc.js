module.exports = {
	root: true,
	extends: [
		'airbnb-base',
	],
	parserOptions: {
		parser: 'babel-eslint',
	},
	env: {
		jest: true,
	},
	rules: {
		'no-console': 'error',
		'no-debugger': 'error',
		indent: [
			'error',
			'tab',
			{
				SwitchCase: 1,
				VariableDeclarator: 1,
				outerIIFEBody: 1,
				FunctionDeclaration: {
					parameters: 1,
					body: 1,
				},
				FunctionExpression: {
					parameters: 1,
					body: 1,
				},
				CallExpression: {
					arguments: 1,
				},
				ArrayExpression: 1,
				ObjectExpression: 1,
				ImportDeclaration: 1,
				flatTernaryExpressions: false,
				ignoredNodes: [
					'JSXElement',
					'JSXElement *',
				],
			},
		],
		'no-tabs': 0,
		'no-void': 0,
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: true,
			},
		],
	},
};
