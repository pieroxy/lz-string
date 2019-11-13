#! /usr/bin/env node
var lzString = require('../libs/lz-string.js');
var fs = require('fs');

if (process.argv.length < 3) {
  console.error('Usage: lz-string [funcName] <input_file>');
  process.exit(1);
}

var funcName = 'compress',
    filePath = process.argv[2];

if (process.argv.length == 4) {
    funcName = process.argv[2];
    filePath = process.argv[3];
}

console.log(lzString[funcName](fs.readFileSync(filePath, {
  encoding: 'utf8',
})));
