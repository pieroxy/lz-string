/* eslint-disable @typescript-eslint/ban-ts-comment */
import { test, expect } from "vitest";

/** A known long text source, eaxh set of tests must have a compressed version to compare to */
export const test_tattooSource =
    "During tattooing, ink is injected into the skin, initiating an immune response, and cells called \"macrophages\" move into the area and \"eat up\" the ink. The macrophages carry some of the ink to the body's lymph nodes, but some that are filled with ink stay put, embedded in the skin. That's what makes the tattoo visible under the skin. Dalhousie Uiversity's Alec Falkenham is developing a topical cream that works by targeting the macrophages that have remained at the site of the tattoo. New macrophages move in to consume the previously pigment-filled macrophages and then migrate to the lymph nodes, eventually taking all the dye with them. \"When comparing it to laser-based tattoo removal, in which you see the burns, the scarring, the blisters, in this case, we've designed a drug that doesn't really have much off-target effect,\" he said. \"We're not targeting any of the normal skin cells, so you won't see a lot of inflammation. In fact, based on the process that we're actually using, we don't think there will be any inflammation at all and it would actually be anti-inflammatory.";

/** All printable ascii characters  */
export const test_allAscii = (() => {
    const testValue: string[] = [];

    for (let i = 32; i < 127; i++) {
        testValue.push(String.fromCharCode(i));
    }

    return testValue.join("");
})();

/** All printable unicode characters */
export const test_allUtf16 = (() => {
    const testValue = [test_allAscii];

    for (let i = 160; i < 55296; i++) {
        testValue.push(String.fromCharCode(i));
    }
    for (let i = 63744; i < 65536; i++) {
        testValue.push(String.fromCharCode(i));
    }

    return testValue.join("");
})();

/** Random (rarely compressable) string, important to be different for every test */
export const test_randomString_fn = () => {
    const testValue: string[] = [];
    const randomAscii = test_allAscii.split("");

    while (testValue.length < 1000) {
        // eslint-disable-next-line prefer-spread
        testValue.push.apply(testValue, randomAscii);
    }
    testValue.sort(() => Math.random() - 0.5);

    return testValue.join("");
};

/** Over 10k random numbers, important to be different for every test */
export const test_longString_fn = () => {
    const testValue: string[] = [];

    while (testValue.length < 10000) {
        testValue.push(String(Math.random()));
    }

    return testValue.join(" ");
};

/**
 * This will run a series of tests against each compress / decompress pair.
 *
 * All tests must (where possible):
 * - Check that it doesn't output null unless expected
 * - Check that the compression is deterministic
 * - Check that it changes the input string
 * - Check that it can decompress again
 * - Compression makes thing smaller
 * - Check against a known good value
 */
export function runTestSet<T extends { length: number }>(
    compressFunc: (input: string | null) => T | null,
    decompressFunc: (input: T | null) => string | null,
    compressedTattoo?: T,
) {
    test(`"Hello World"`, () => {
        const test_hw = "Hello world!";
        const compressedHw = compressFunc(test_hw);

        expect(compressedHw).toEqual(compressFunc(test_hw));
        expect(compressedHw).not.toEqual(test_hw);
        expect(decompressFunc(compressedHw)).toEqual(test_hw);
    });

    test(`null`, () => {
        const test_null = null;
        const compressedNull = compressFunc(test_null);

        compressedNull instanceof Uint8Array
            ? expect(compressedNull.length).toBe(0)
            : expect(compressedNull).toEqual("");
    });

    test(`"" (empty string)`, () => {
        const test_empty = "";
        const compressedEmpty = compressFunc(test_empty);

        expect(compressedEmpty).toEqual(compressFunc(test_empty));
        expect(compressedEmpty).not.toEqual("");
        compressedEmpty instanceof Uint8Array
            ? expect(compressedEmpty.length).not.toBe(0)
            : expect(typeof compressedEmpty).toBe("string");
        expect(decompressFunc(compressedEmpty)).toEqual(test_empty);
    });

    test(`undefined`, () => {
        const test_undefined = undefined;
        // @ts-expect-error
        const compressedUndefined = compressFunc(test_undefined);

        compressedUndefined instanceof Uint8Array
            ? expect(compressedUndefined.length).toBe(0)
            : expect(compressedUndefined).toBe("");
    });

    test(`utf16`, () => {
        const compressedUtf16 = compressFunc(test_allUtf16);

        expect(compressedUtf16).not.toEqual(null);
        expect(compressedUtf16).toEqual(compressFunc(test_allUtf16));
        expect(compressedUtf16).not.toEqual(test_allUtf16);
        expect(decompressFunc(compressedUtf16)).toEqual(test_allUtf16);
    });

    test(`Repeating String`, () => {
        const test_repeat = "aaaaabaaaaacaaaaadaaaaaeaaaaa";
        const compressedRepeat = compressFunc(test_repeat)!;

        expect(compressedRepeat).not.toEqual(null);
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

    test(`Long String`, () => {
        const test_longString = test_longString_fn(); // Unique per run
        const compressedLongString = compressFunc(test_longString)!;

        expect(compressedLongString).toEqual(compressFunc(test_longString));
        expect(compressedLongString).not.toEqual(test_longString);
        expect(compressedLongString.length).toBeLessThan(test_longString.length);
        expect(decompressFunc(compressedLongString)).toEqual(test_longString);
    });

    if (compressedTattoo) {
        test(`expected compression result`, () => {
            expect(compressFunc(test_tattooSource)).toEqual(compressedTattoo);
        });

        test(`expected decompression result`, () => {
            expect(decompressFunc(compressedTattoo)).toEqual(test_tattooSource);
        });
    }
}
