# Defaults for running lz-string version 1

if [ ! -d "../node_modules/lz-string-1.5.0" ]; then
    echo "Need to install lz-string@1.5.0 first!"
    echo ""
    npm install -no-save lz-string-1.5.0@npm:lz-string@1.5.0
fi

# We use the modern cli and override the library it uses - the original CLI saved utf8 which loses data

optDescription="Running using legacy lz-string and the current cli command"

optCommand=../bin/cli.cjs # Relative to test script
optArgs="-v --legacy --lib ../node_modules/lz-string-1.5.0/libs/lz-string.js"
optDecompress="-d"
optEncoder="-e"
optEncoders="base64,encodeduri,raw,uint8array,utf16"
optOutput="-o"
optQuiet="-q"
