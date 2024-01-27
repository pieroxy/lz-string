# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - v2

- Converted to true Typescript
- Separated into multiple files, so you can tree-shake effectively
  - ESModule imports are split by source file fo full tree shaking
  - CommonJS requires a single file (but should be tree-shakeable with good tools)
  - UMD is a single file with a global namespace (similar to the old version)
  - All files have full SourceMap support
- Added a test script (`test.sh`) and strategy for both internal and external tools
  - Tests now use a dedicated `test/data/` folder of of folders, each containing a file named `data.bin`
  - Each compression tool can have a separate profile for the test script to know how to address it
  - There are also binary files for expected output of each encoding type
  - Can be used to determine compatibiity between implementations
- Added more comprehensive testing for code
  - Uses the same data folder as the test script
  - Allows for custom testing beyond the "compatibility" requirements
- Expanded CLI tool
  - Can use to compress and decompress using each type of encoding
  - Now binary safe for data (previous tool was `utf8` which could lose data)

## [1.5.0] - 2023-06-20

- Minified version

## [1.4.5] - 2023-06-20

- Changed to MIT license
- Specific support for angular
- Improved typescript typings

## [1.4.4] - 2015-05-25

- Fix for IE6&7
  - Removed the use of the bracket notation for accessing chars in a string.

## [1.4.3] - 2015-04-26

- amd loaders code and typescript support

## [1.4.2] - 2015-03-25

- Bugfix in decompressFromEncodedURIComponent
  - On the server side, '+' characters are replaced by ' ' (whitespace) and the resulting string cannot be decompressed.
  - The fix is ugly but it works and is 100% compatible with old versions.

## [1.4.1] - 2015-03-23

- Uses arrays instead of strings when building the output
  - This ends up being slightly slower on some combinations of OS/Browser, but the process consumes far less memory, and the strings produced as well consumes much less memory.

## [1.4.0-beta] - 2015-02-19

This avoids calling compress and then re-encoding the results in UTF-16, base64 or URIEncoded string.

As a result:

- The compress method is slightly slower.
- The compressToUTF16, compressToBase64 and compressToEncodedURIComponent are slightly faster (in theory).
- Binary compatibility for decompression is still there. This means any String compressed with an old version of the library can be decompressed by this version, and any String compressed by version 1.4.0 can be decompressed by an older version.
- Binary compatibility for compression is not guaranteed, meaning the output from this version may be different than the output produced by an older version. This is trailing characters that are useless that are now omitted.

NOTE: Releasing this as the performaces seems good except for base64 and uri component on IE. Those don(t take too big of a hit and are designed to send the compressed data to the network (usually internet which is orders of magnitude slower than the compression algo). So I'm going with it.

## [1.3.9] - 2015-02-18

- Includes a fix for decompressFromUint8Array on Safari/Mac.

## [1.3.8] - 2015-02-15

- Small performance improvements.

## [1.3.7] - 2015-01-16

- Minor release, fixing bower.json.

## [1.3.6] - 2014-12-18

- Bugfix on compressToEncodedURIComponent and decompressFromEncodedURIComponent.

## [1.3.5] - 2014-11-30

- It allows compression to produce URI safe strings (ie: no need to URL encode them) through the method compressToEncodedURIComponent.

## [1.3.4] - 2014-07-29

July 29, 2014: version 1.3.4 has been pushed. It allows compression to produce uint8array instead of Strings.
Some things happened in the meantime, giving birth to versions 1.3.1, 1.3.2 and 1.3.3. Version 1.3.3 was promoted the winner later on. And I forgot about the changelog. The gory details are on GitHub.

## [1.3.0] - 2013-07-17

- Introduced two new methods: compressToUTF16 and decompressFromUTF16. These allow lz-string to produce something that you can store in localStorage on IE and Firefox.

## [1.2.0] - 2013-06-12

- Introduced two new methods: compressToBase64 and decompressFromBase64. These allow lz-string to produce something that you can send through the network.

## [1.1.0] - 2013-05-27

- Two files can be downloaded: lz-string-1.1.0.js and lz-string-1.1.0-min.js, its minified evil twin weighting a mere 3455 bytes.
- Released base64-string-v1.0.0.js.
- Optimized implementation: 10-20% faster compression, twice as fast decompression on most browsers (no change on Chrome)

## [1.0.1] - 2013-05-19

- Thanks to jeff-mccoy, a fix for Chrome on Mac throwing an error because of the use of a variable not declared. JavaScript is so great!

## [1.0.0] - 2013-05-08

- First release
