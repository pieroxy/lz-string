#! /usr/bin/env node
var lzString = require('../libs/reference/lz-string-1.3.3.js');
var fs = require('fs');

if (process.argv.length < 3) {
  console.error('Usage: lz-string <input_file>');
  process.exit(1);
}

console.log(lzString.compress(fs.readFileSync(process.argv[2], {
  encoding: 'utf8',
})));

