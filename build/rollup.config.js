// rollup.config.js
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

const baseConfig = {
	input: 'src/lz-string.js',
	plugins: [
		replace({
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
		commonjs(),
	],
};

// UMD/IIFE shared settings: externals and output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const external = [
	// list external dependencies, exactly the way it is written in the import statement.
	// eg. 'jquery'
];
const globals = {
	// Provide global variable names to replace your external imports
	// eg. jquery: '$'
};

// Different plugins required for each build (terser, angular factory, etc.) - since
// plugins are declared at top level instead of per-output, use array of inputs
export default [
	// es build
	{
		...baseConfig,
		output: {
			compact: true,
			file: 'libs/lz-string.esm.js',
			format: 'esm',
		},
		plugins: [
			...baseConfig.plugins,
			terser({
				output: {
					ecma: 6,
					preamble: '/* eslint-disable */',
				},
			}),
		],

	},

	// umd build
	{
		...baseConfig,
		external,
		output: {
			file: 'libs/lz-string.js',
			format: 'umd',
			name: 'LZString',
			globals,
		},
		plugins: [
			...baseConfig.plugins,
			buble(),
			// Legacy support - register as angularjs module with LZString as a Factory.
			// Until rollup allows custom finalizers, hook into generateBundle and append angular
			// module registration to umd ternary immediately before global (window) registration
			// of the library
			(_options => ({ // eslint-disable-line no-unused-vars
				name: 'angular.module.factory',
				generateBundle(opts, bundle) {
					const filename = opts.file.replace('libs/', '');
					const angularFactory = `
  typeof angular !== 'undefined' && angular !== null ? (
    angular.module('LZString',[])
      .factory('LZString', function () {
        var instance = {};
        factory(instance);
        return instance;
      })
  ) :`;
					bundle[filename].code = bundle[filename].code
						.replace(
							/(define\(\['exports'], factory\) :)/,
							`$1${angularFactory}`,
						);
				},
			}))(),
		],
	},

	// iife build
	{
		...baseConfig,
		external,
		output: {
			compact: true,
			file: 'libs/lz-string.min.js',
			format: 'iife',
			name: 'LZString',
			globals,
		},
		plugins: [
			...baseConfig.plugins,
			buble(),
			terser({
				output: {
					ecma: 5,
				},
			}),
		],
	},
]
