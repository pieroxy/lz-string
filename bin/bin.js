#! /usr/bin/env node
/* eslint-disable no-var,no-console,comma-dangle */
var fs = require('fs');
var lzString = require('../libs/lz-string.js');

if (process.argv.length < 3) {
	console.error('Usage: lz-string <input_file>');
	process.exit(1);
}

console.log(
	lzString.compress(
		fs.readFileSync(
			process.argv[2],
			{
				encoding: 'utf8'
			}
		)
	)
);
