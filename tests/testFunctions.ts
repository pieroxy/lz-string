import { test, expect, describe } from "vitest";
import {
    test_allUtf16,
    test_empty,
    test_hw,
    test_longString_fn,
    test_null,
    test_randomString_fn,
    test_repeat,
    test_tattooBase64,
    test_tattooEncodedURIComponent,
    test_tattooEncodedURIComponentPlus,
    test_tattooSource,
    test_tattooUint8Array,
    test_tattooUTF16,
    test_undefined,
} from "./testValues";
import type { LZString } from "../src/main";

/**
 * Expected to be called from within a `describe`. This will pass the name and
 * compress / decompress pair, as well as a "known good" value for all output
 * methods.
 */
export function runAllTests(implementation: LZString) {
    runTestSet("Stock Compression and Decompression", implementation.compress, implementation.decompress);

    runTestSet(
        "Base64 Compression and Decompression",
        implementation.compressToBase64,
        implementation.decompressFromBase64,
        test_tattooBase64,
    );

    runTestSet(
        "UTF16 Compression and Decompression",
        implementation.compressToUTF16,
        implementation.decompressFromUTF16,
        test_tattooUTF16,
    );

    runTestSet(
        "Uint8Array Compression and Decompression",
        implementation.compressToUint8Array,
        implementation.decompressFromUint8Array,
        test_tattooUint8Array,
    );

    runTestSet(
        "EncodedURIComponent Compression and Decompression",
        implementation.compressToEncodedURIComponent,
        implementation.decompressFromEncodedURIComponent,
        test_tattooEncodedURIComponentPlus,
        true,
    );
}

/**
 * This will run a series of tests against each compress / decompress pair.
 *
 * All tests must (where possible):
 * - Check that the compression is deterministic
 * - Check that it changes the input string
 * - Check that it can decompress again
 * - Compression makes thing smaller
 * - Check against a known good value
 */
function runTestSet(desc: string, compressFunc, decompressFunc, compressedTattoo?, testEncodedURI?: boolean) {
    describe(desc, () => {
        test(`"Hello World"`, () => {
            const compressedHw = compressFunc(test_hw);

            expect(compressedHw).toEqual(compressFunc(test_hw));
            expect(compressedHw).not.toEqual(test_hw);
            expect(decompressFunc(compressedHw)).toEqual(test_hw);
        });

        test(`null`, () => {
            const compressedNull = compressFunc(test_null);

            compressedNull instanceof Uint8Array
                ? expect(compressedNull.length).toBe(0)
                : expect(compressedNull).toEqual("");
        });

        test(`"" (empty string)`, () => {
            const compressedEmpty = compressFunc(test_empty);

            expect(compressedEmpty).toEqual(compressFunc(test_empty));
            expect(compressedEmpty).not.toEqual("");
            compressedEmpty instanceof Uint8Array
                ? expect(compressedEmpty.length).not.toBe(0)
                : expect(typeof compressedEmpty).toBe("string");
            expect(decompressFunc(compressedEmpty)).toEqual(test_empty);
        });

        test(`undefined`, () => {
            const compressedUndefined = compressFunc(test_undefined);

            compressedUndefined instanceof Uint8Array
                ? expect(compressedUndefined.length).toBe(0)
                : expect(compressedUndefined).toBe("");
        });

        test(`utf16`, () => {
            const compressedUtf16 = compressFunc(test_allUtf16);

            expect(compressedUtf16).toEqual(compressFunc(test_allUtf16));
            expect(compressedUtf16).not.toEqual(test_allUtf16);
            expect(decompressFunc(compressedUtf16)).toEqual(test_allUtf16);
        });

        test(`Repeating String`, () => {
            const compressedRepeat = compressFunc(test_repeat);

            expect(compressedRepeat).toEqual(compressFunc(test_repeat));
            expect(compressedRepeat).not.toEqual(test_repeat);
            expect(compressedRepeat.length).toBeLessThan(test_repeat.length);
            expect(decompressFunc(compressedRepeat)).toEqual(test_repeat);
        });

        // Note that this is designed to be uncompressible
        test(`Random String`, () => {
            const test_randomString = test_randomString_fn(); // Unique per test
            const compressedRandomString = compressFunc(test_randomString);

            expect(compressedRandomString).toEqual(compressFunc(test_randomString));
            expect(compressedRandomString).not.toEqual(test_randomString);
            expect(decompressFunc(compressedRandomString)).toEqual(test_randomString);
        });

        const test_longString = test_longString_fn(); // Unique per run
        const compressedLongString = compressFunc(test_longString);

        test(`Long String`, () => {
            expect(compressedLongString).toEqual(compressFunc(test_longString));
            expect(compressedLongString).not.toEqual(test_longString);
            expect(compressedLongString.length).toBeLessThan(test_longString.length);
            expect(decompressFunc(compressedLongString)).toEqual(test_longString);
        });

        if (testEncodedURI) {
            test(`All chars are URL safe`, () => {
                expect(compressedLongString.indexOf("=")).toBe(-1);
                expect(compressedLongString.indexOf("/")).toBe(-1);
                expect(decompressFunc(compressedLongString)).toBe(test_longString);
            });

            test(`+ and ' ' are interchangeable in decompression`, () => {
                expect(test_tattooSource).toEqual(decompressFunc(test_tattooEncodedURIComponent));
            });
        }

        if (compressedTattoo) {
            test(`expected compression result`, () => {
                expect(compressFunc(test_tattooSource)).toEqual(compressedTattoo);
            });
            test(`expected decompression result`, () => {
                expect(decompressFunc(compressedTattoo)).toEqual(test_tattooSource);
            });
        }
    });
}
