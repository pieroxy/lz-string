/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { readFileSync } from "fs";
import { relative } from "path";
import { test, describe, vi } from "vitest";

/**
 * Folder names within testdata, with a human readable name.
 */
const testDataFiles: Record<string, string> = {
    all_ascii: "ASCII",
    all_utf16: "UTF16",
    lorem_ipsum: "Lorem Ipsum",
    hello_world: '"Hello World!"',
    pi: "10,000 digits of pi",
    repeated: "Repeated string",
    tattoo: "Tattoo text",
};

/**
 * Cache of the data so we only need to load it once for all tests.
 */
const cachedTestData: Record<string, string> = {};

/**
 * Function to load testdata files. Caches results so it only needs to be done
 * once.
 */
export function getTestData(name: string) {
    if (!testDataFiles[name]) {
        throw new Error("Unknown test data");
    }

    return cachedTestData[name] || (cachedTestData[name] = readFileSync(`testdata/${name}/data.bin`).toString());
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function runGeneralTests(identifier: string, compressFunc: (input: any) => any, decompressFunc: (input: any) => any) {
    for (const path in testDataFiles) {
        const name = testDataFiles[path];

        describe(name, () => {
            const rawData = getTestData(path);
            const compressedData = compressFunc(rawData);

            test("consistent", ({ expect }) => {
                expect(compressedData).toEqual(compressFunc(rawData));
            });
            test("alter data", ({ expect }) => {
                expect(compressedData).not.toEqual(rawData);
            });
            test("decompresses", ({ expect }) => {
                expect(decompressFunc(compressedData)).toEqual(rawData);
            });

            if (identifier) {
                const knownCompressed = readFileSync(`testdata/${path}/js/${identifier}.bin`).toString();

                test("expected compression result", ({ expect }) => {
                    expect(compressFunc(rawData)).toEqual(knownCompressed);
                });
                test(`expected decompression result`, ({ expect }) => {
                    expect(decompressFunc(knownCompressed)).toEqual(rawData);
                });
            }
        });
    }
}

/**
 * This will run a series of tests against each compress / decompress pair.
 *
 * All tests must (where possible):
 * - Check that it doesn't output null unless expected
 * - Check that the compression is deterministic
 * - Check that it changes the input string
 * - Check that it can decompress again
 * - Check against a known good value
 */
export function runTestSet<T extends { length: number }>(
    identifier: string,
    compressFunc: (input: string | null) => T | null,
    decompressFunc: (input: T | null) => string | null,
) {
    // Specific internal behaviour
    test(`null`, ({ expect }) => {
        const compressedNull = compressFunc(null);

        compressedNull instanceof Uint8Array
            ? expect(compressedNull.length).toBe(0)
            : expect(compressedNull).toEqual("");
    });

    // Specific internal behaviour
    test(`undefined`, ({ expect }) => {
        const compressedUndefined = compressFunc(undefined!);

        compressedUndefined instanceof Uint8Array
            ? expect(compressedUndefined.length).toBe(0)
            : expect(compressedUndefined).toBe("");
    });

    // Specific internal behaviour
    test(`"" (empty string)`, ({ expect }) => {
        const compressedEmpty = compressFunc("");

        expect(compressedEmpty).toEqual(compressFunc(""));
        expect(compressedEmpty).not.toEqual("");
        compressedEmpty instanceof Uint8Array
            ? expect(compressedEmpty.length).not.toBe(0)
            : expect(typeof compressedEmpty).toBe("string");
        expect(decompressFunc(compressedEmpty)).toEqual("");
    });

    runGeneralTests(identifier, compressFunc, decompressFunc)
}

/**
 * This will run a series of tests against each compress / decompress pair.
 *
 * All tests must (where possible):
 * - Check that it doesn't output null unless expected
 * - Check that the compression is deterministic
 * - Check that it changes the input string
 * - Check that it can decompress again
 * - Check against a known good value
 */
export function runNewerTestSet<T extends { length: number }>(
    identifier: string,
    compressFunc: (input: string) => T,
    decompressFunc: (input: T) => string,
) {
    // Specific internal behaviour
    test(`undefined`, ({ expect }) => {
        const compressedUndefined = compressFunc(undefined!);

        compressedUndefined instanceof Uint8Array
            ? expect(compressedUndefined.length).toBe(0)
            : expect(compressedUndefined).toBe("");
    });

    // Specific internal behaviour
    test(`"" returns (empty string)`, ({ expect }) => {
        const compressedEmpty = compressFunc("");

        expect(compressedEmpty).toEqual(compressFunc(""));
        expect(compressedEmpty).toEqual("");
        compressedEmpty instanceof Uint8Array
            ? expect(compressedEmpty.length).not.toBe(0)
            : expect(typeof compressedEmpty).toBe("string");
        expect(decompressFunc(compressedEmpty)).toEqual("");
    });

    runGeneralTests(identifier, compressFunc, decompressFunc)
}

export async function testMockedLZString(importPath: string, displayName: string) {
    const relativePath = relative(process.cwd(), importPath);

    describe(`${relativePath.startsWith(".") ? importPath : relativePath} (${displayName})`, async () => {
        const LZString = await import(importPath);
        const methods: Record<string, string> = {
            base64: "Base64",
            custom: "Custom",
            encodedURIComponent: "EncodedURIComponent",
            stock: "",
            Uint8Array: "Uint8Array",
            UTF16: "UTF16",
        };

        for (const path in methods) {
            const name = methods[path];
            const compress = `compress${name ? `To${name}` : ""}`;
            const decompress = `decompress${name ? `From${name}` : ""}`;

            vi.doMock(`../${path}/${compress}`, async (importOriginal) => ({
                ...((await importOriginal()) as Record<string, unknown>),
                [compress]: LZString[compress] ?? LZString.default[compress],
            }));
            vi.doMock(`../${path}/${decompress}`, async (importOriginal) => ({
                ...((await importOriginal()) as Record<string, unknown>),
                [decompress]: LZString[decompress] ?? LZString.default[decompress],
            }));
            await import(`../${path}/${path}.test.ts`);
        }
    });
}
