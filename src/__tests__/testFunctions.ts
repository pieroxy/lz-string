/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { relative } from "path";
import { describe, test, vi } from "vitest";

import { loadBinaryFile } from "../node";

/**
 * Folder names within testdata, with a human readable name.
 */
export const testDataFiles: Record<string, string> = {
    all_ascii: "All ASCII",
    all_utf16: "All UTF16",
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

    return cachedTestData[name] || (cachedTestData[name] = loadBinaryFile(`test/data/${name}/data.bin`));
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
    decompressFunc: (input: T | null) => string | null | undefined,
) {
    // Specific internal behaviour
    test(`null`, ({ expect }) => {
        const compressedNull = compressFunc(null);

        compressedNull instanceof Uint8Array
            ? expect.soft(compressedNull.length).toBe(0)
            : expect.soft(compressedNull).toEqual("");
        expect.soft(decompressFunc(null)).toEqual("");
    });

    // Specific internal behaviour
    test(`undefined`, ({ expect }) => {
        const compressedUndefined = compressFunc(undefined!);

        compressedUndefined instanceof Uint8Array
            ? expect.soft(compressedUndefined.length).toBe(0)
            : expect.soft(compressedUndefined).toBe("");
        // @ts-expect-error Overriding type for testing
        expect.soft(decompressFunc(undefined)).toEqual("");
    });

    // Specific internal behaviour
    test(`"" (empty string)`, ({ expect }) => {
        const compressedEmpty = compressFunc("");

        expect.soft(compressedEmpty).toEqual(compressFunc(""));
        expect.soft(compressedEmpty).not.toEqual("");
        compressedEmpty instanceof Uint8Array
            ? expect.soft(compressedEmpty.length).not.toBe(0)
            : expect.soft(typeof compressedEmpty).toBe("string");
        expect.soft(decompressFunc(compressedEmpty)).toEqual("");
        // @ts-expect-error Overriding type for testing
        expect.soft(decompressFunc("")).toEqual(null);
    });

    for (const path in testDataFiles) {
        const name = testDataFiles[path];

        describe(name, () => {
            const rawData = getTestData(path);
            const compressedData = compressFunc(rawData);

            test("consistent", ({ expect }) => {
                expect.soft(compressedData).toEqual(compressFunc(rawData));
            });
            test("alter data", ({ expect }) => {
                expect.soft(compressedData).not.toEqual(rawData);
            });
            test("decompresses", ({ expect }) => {
                expect.soft(decompressFunc(compressedData)).toEqual(rawData);
            });

            if (identifier) {
                const knownCompressed = loadBinaryFile(`test/data/${path}/${identifier}.bin`);

                test("expected compression result", ({ expect }) => {
                    expect.soft(compressFunc(rawData)).toEqual(knownCompressed);
                });
                test(`expected decompression result`, ({ expect }) => {
                    // @ts-expect-error We don't know the type
                    expect.soft(decompressFunc(knownCompressed)).toEqual(rawData);
                });
            }
        });
    }
}

export async function testMockedLZString(importPath: string, displayName: string) {
    const relativePath = relative(process.cwd(), importPath);

    describe(`${relativePath.startsWith(".") ? importPath : relativePath} (${displayName})`, async () => {
        const LZString = await import(importPath);
        const methods: Record<string, string> = {
            base64: "Base64",
            custom: "Custom",
            encodedURIComponent: "EncodedURIComponent",
            raw: "",
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
            await import(`../${path}/__tests__/${path}.test.ts`);
        }
    });
}
