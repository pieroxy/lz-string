#! /usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const lzString = require("../dist/index.cjs");
const fs = require("fs");
const pkg = require("../package.json");
const { Option, program } = require("commander");

function compressContent(format, content) {
    switch (format) {
        case "base64":
            return lzString.compressToBase64(content);
        case "encodeduri":
            return lzString.compressToEncodedURIComponent(content);
        case "raw":
        default:
            return lzString.compress(content);
        case "uint8array":
            return lzString.compressToUint8Array(content);
        case "utf16":
            return lzString.compressToUTF16(content);
    }
}

function decompressContent(format, content) {
    switch (format) {
        case "base64":
            return lzString.decompressFromBase64(content);
        case "encodeduri":
            return lzString.decompressFromEncodedURIComponent(content);
        case "raw":
        default:
            return lzString.decompress(content);
        case "uint8array":
            return lzString.decompressFromUint8Array(content);
        case "utf16":
            return lzString.decompressFromUTF16(content);
    }
}

program
    .version(pkg.version)
    .description("Use lz-string to compress or decompress a file")
    .addOption(new Option("-d, --decompress", "if unset then this will compress"))
    .addOption(
        new Option("-f, --format <type>", "formatter to use")
            .choices(["base64", "encodeduri", "raw", "uint8array", "utf16"])
            .default("raw"),
    )
    .addOption(new Option("-v, --validate", "validate before returning").default(true))
    .addOption(new Option("-o, --output <output-file>", "output file"))
    .addOption(new Option("-q, --quiet", "don't print any error messages"))
    .argument("<input-file>", "file to process")
    .showHelpAfterError()
    .action((file, { format, decompress, output, quiet, validate }) => {
        if (!fs.existsSync(file)) {
            if (!quiet) process.stderr.write(`Unable to find ${file}`);
            process.exit(1);
        }
        try {
            fs.accessSync(file, fs.constants.R_OK);
        } catch {
            if (!quiet) process.stderr.write(`Unable to read ${file}`);
            process.exit(1);
        }
        const unprocessed = fs.readFileSync(file).toString();
        const processed = decompress ? decompressContent(format, unprocessed) : compressContent(format, unprocessed);

        if (validate) {
            const validated = decompress ? compressContent(format, processed) : decompressContent(format, processed);
            let valid = unprocessed.length === validated.length;

            for (let i = 0; valid && i < unprocessed.length; i++) {
                if (unprocessed[i] !== validated[i]) {
                    valid = false;
                }
            }
            if (!valid) {
                if (!quiet) process.stderr.write(`Unable to validate ${file}`);
                process.exit(1);
            }
        }
        if (processed == null) {
            if (!quiet) process.stderr.write(`Unable to process ${file}`);
            process.exit(1);
        }
        if (output) {
            fs.writeFileSync(output, processed, null);
        } else {
            process.stdout.write(processed);
        }
    })
    .parse();
