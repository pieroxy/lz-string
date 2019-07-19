// rollup.config.js
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

const baseConfig = {
	input: 'src/lz-string.js',
	plugins: {
		pre: [
			replace({
				'process.env.NODE_ENV': JSON.stringify('production'),
			}),
			commonjs(),
		],
		post: [
			buble(),
		],
	},
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

// Customize configs for individual targets
const buildFormats = [];
if (!argv.format || argv.format === 'es') {
	const esConfig = {
		...baseConfig,
		output: {
			file: 'libs/lz-string.esm.js',
			format: 'esm',
		},
		plugins: [
			...baseConfig.plugins.pre,
			...baseConfig.plugins.post,
			terser({
				output: {
					ecma: 6,
					preamble: '/* eslint-disable */',
				},
			}),
		],
	};
	buildFormats.push(esConfig);
}

if (!argv.format || argv.format === 'umd') {
	const umdConfig = {
		...baseConfig,
		external,
		output: {
			compact: true,
			file: 'libs/lz-string.js',
			format: 'umd',
			name: 'LZString',
			globals,
		},
		plugins: [
			...baseConfig.plugins.pre,
			...baseConfig.plugins.post,

			// Legacy support - register as angularjs module with LZString as a Factory.
			// Until rollup allows custom finalizers, hook into generateBundle and append angular
			// module registration to umd ternary immediately before global (window) registration
			// of the library
			(_options => ({ // eslint-disable-line no-unused-vars
				name: 'angular.module.factory',
				generateBundle(opts, bundle) {
					const filename = opts.file.replace('libs/', '');
					// eslint-disable-next-line no-param-reassign
					bundle[filename].code = bundle[filename].code.replace(/(exports'],(.)\):)/, '$1typeof angular!==\'undefined\'&&angular!==null?angular.module(\'LZString\',[]).factory(\'LZString\',function(){var i={};$2(i);return i}):');
				},
			}))(),
		],
	};
	buildFormats.push(umdConfig);
}

if (!argv.format || argv.format === 'iife') {
	const unpkgConfig = {
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
			...baseConfig.plugins.pre,
			...baseConfig.plugins.post,
			terser({
				output: {
					ecma: 5,
				},
			}),
		],
	};
	buildFormats.push(unpkgConfig);
}

// Export config
export default buildFormats;
