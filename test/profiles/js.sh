# Defaults for running lz-string esmodule

optDescription="Running using the ESModule build of lz-string"

optCommand=../bin/cli.cjs # Relative to test script
optArgs="-v --lib ../dist/index.js"
optDecompress=-d
optEncoder="-e"
optEncoders="base64,encodeduri,raw,uint8array,utf16"
optOutput="-o"
optQuiet="-q"
