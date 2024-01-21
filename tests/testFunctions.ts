import { describe } from "vitest";
import {
    test_allUtf16,
    test_empty,
    test_hw,
    test_longString_fn,
    test_null,
    test_repeat,
    test_tattooBase64,
    test_tattooBase64URL,
    test_tattooBetterBase64,
    test_tattooEncodedURIComponent,
    test_tattooEncodedURIComponentPlus,
    test_tattooSource,
    test_tattooUint8Array,
    test_tattooUTF16,
    test_undefined,
} from "./testValues";
import {
    allCharsUrlSafe_test,
    compressKnownString_test,
    decompressKnownString_test,
    emptyResponse_test,
    helloWorld_test,
    interchangableChars_test,
    longString_test,
    nullResponse_test,
    randomString_test,
    repeatingString_test,
    undefinedResponse_test,
    utf16Response_test,
} from "./suite";
import LZString from "../src";

type TImplementation = typeof LZString

/**
 * Expected to be called from within a `describe`. This will pass the name and
 * compress / decompress pair, as well as a "known good" value for all output
 * methods.
 */
export function runAllTests (implementation: TImplementation) {
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
    stockTestSet(implementation);

    base64TestSet(implementation);

    betterBase64TestSet(implementation);

    base64URLTestSet(implementation);

    utf16TestSet(implementation);

    uint8ArrayTestSet(implementation);

    encodedURITestSet(implementation);
}

function stockTestSet (implementation: TImplementation) {
    const { compress, decompress } = implementation

    describe("Stock Compression and Decompression", () => {
        nullResponse_test(compress, decompress, test_null);
        emptyResponse_test(compress, decompress, test_empty);
        undefinedResponse_test(compress, decompress, test_undefined);
        utf16Response_test(compress, decompress, test_allUtf16);
        helloWorld_test(compress, decompress, test_hw);
        repeatingString_test(compress, decompress, test_repeat);
        randomString_test(compress, decompress);

        const test_longString = test_longString_fn(); // Unique per run
        const compressedLongString = compress(test_longString);

        longString_test(compress, decompress, test_longString, compressedLongString);
    });
}

function base64TestSet (implementation: TImplementation) {
    const { compressToBase64, decompressFromBase64 } = implementation

    describe("Base64 Compression and Decompression", () => {
        nullResponse_test(compressToBase64, decompressFromBase64, test_null);
        emptyResponse_test(compressToBase64, decompressFromBase64, test_empty);
        undefinedResponse_test(compressToBase64, decompressFromBase64, test_undefined);
        utf16Response_test(compressToBase64, decompressFromBase64, test_allUtf16);
        helloWorld_test(compressToBase64, decompressFromBase64, test_hw);
        repeatingString_test(compressToBase64, decompressFromBase64, test_repeat);
        randomString_test(compressToBase64, decompressFromBase64);

        const test_longString = test_longString_fn(); // Unique per run
        const compressedLongString = compressToBase64(test_longString);

        longString_test(compressToBase64, decompressFromBase64, test_longString, compressedLongString);

        compressKnownString_test(compressToBase64, test_tattooSource, test_tattooBase64);
        decompressKnownString_test(decompressFromBase64, test_tattooSource, test_tattooBase64);
    });
}

function betterBase64TestSet (implementation: TImplementation) {
    const { compressToBetterBase64, decompressFromBetterBase64 } = implementation

    describe("BetterBase64 Compression and Decompression", () => {
        nullResponse_test(compressToBetterBase64, decompressFromBetterBase64, test_null);
        emptyResponse_test(compressToBetterBase64, decompressFromBetterBase64, test_empty);
        undefinedResponse_test(compressToBetterBase64, decompressFromBetterBase64, test_undefined);
        utf16Response_test(compressToBetterBase64, decompressFromBetterBase64, test_allUtf16);
        helloWorld_test(compressToBetterBase64, decompressFromBetterBase64, test_hw);
        repeatingString_test(compressToBetterBase64, decompressFromBetterBase64, test_repeat);
        randomString_test(compressToBetterBase64, decompressFromBetterBase64);

        const test_longString = test_longString_fn(); // Unique per run
        const compressedLongString = compressToBetterBase64(test_longString);

        longString_test(compressToBetterBase64, decompressFromBetterBase64, test_longString, compressedLongString);

        compressKnownString_test(compressToBetterBase64, test_tattooSource, test_tattooBetterBase64);
        decompressKnownString_test(decompressFromBetterBase64, test_tattooSource, test_tattooBetterBase64);
    });
}

function base64URLTestSet (implementation: TImplementation) {
    const { compressToBase64URL, decompressFromBase64URL } = implementation

    describe("Base64URL Compression and Decompression", () => {
        nullResponse_test(compressToBase64URL, decompressFromBase64URL, test_null);
        emptyResponse_test(compressToBase64URL, decompressFromBase64URL, test_empty);
        undefinedResponse_test(compressToBase64URL, decompressFromBase64URL, test_undefined);
        utf16Response_test(compressToBase64URL, decompressFromBase64URL, test_allUtf16);
        helloWorld_test(compressToBase64URL, decompressFromBase64URL, test_hw);
        repeatingString_test(compressToBase64URL, decompressFromBase64URL, test_repeat);
        randomString_test(compressToBase64URL, decompressFromBase64URL);

        const test_longString = test_longString_fn(); // Unique per run
        const compressedLongString = compressToBase64URL(test_longString);

        longString_test(compressToBase64URL, decompressFromBase64URL, test_longString, compressedLongString);

        compressKnownString_test(compressToBase64URL, test_tattooSource, test_tattooBase64URL);
        decompressKnownString_test(decompressFromBase64URL, test_tattooSource, test_tattooBase64URL);
    });
}

function utf16TestSet (implementation: TImplementation) {
    const { compressToUTF16, decompressFromUTF16 } = implementation

    describe("UTF16 Compression and Decompression", () => {
        nullResponse_test(compressToUTF16, decompressFromUTF16, test_null);
        emptyResponse_test(compressToUTF16, decompressFromUTF16, test_empty);
        undefinedResponse_test(compressToUTF16, decompressFromUTF16, test_undefined);
        utf16Response_test(compressToUTF16, decompressFromUTF16, test_allUtf16);
        helloWorld_test(compressToUTF16, decompressFromUTF16, test_hw);
        repeatingString_test(compressToUTF16, decompressFromUTF16, test_repeat);
        randomString_test(compressToUTF16, decompressFromUTF16);

        const test_longString = test_longString_fn(); // Unique per run
        const compressedLongString = compressToUTF16(test_longString);

        longString_test(compressToUTF16, decompressFromUTF16, test_longString, compressedLongString);

        compressKnownString_test(compressToUTF16, test_tattooSource, test_tattooUTF16);
        decompressKnownString_test(decompressFromUTF16, test_tattooSource, test_tattooUTF16);
    });
}

function uint8ArrayTestSet (implementation: TImplementation) {
    const { compressToUint8Array, decompressFromUint8Array } = implementation

    describe("Uint8Array Compression and Decompression", () => {
        nullResponse_test(compressToUint8Array, decompressFromUint8Array, test_null);
        emptyResponse_test(compressToUint8Array, decompressFromUint8Array, test_empty);
        undefinedResponse_test(compressToUint8Array, decompressFromUint8Array, test_undefined);
        utf16Response_test(compressToUint8Array, decompressFromUint8Array, test_allUtf16);
        helloWorld_test(compressToUint8Array, decompressFromUint8Array, test_hw);
        repeatingString_test(compressToUint8Array, decompressFromUint8Array, test_repeat);
        randomString_test(compressToUint8Array, decompressFromUint8Array);

        const test_longString = test_longString_fn(); // Unique per run
        const compressedLongString = compressToUint8Array(test_longString);

        longString_test(compressToUint8Array, decompressFromUint8Array, test_longString, compressedLongString);

        compressKnownString_test(compressToUint8Array, test_tattooSource, test_tattooUint8Array);
        decompressKnownString_test(decompressFromUint8Array, test_tattooSource, test_tattooUint8Array);
    });
}

function encodedURITestSet (implementation: TImplementation) {
    const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } = implementation

    describe("EncodedURIComponent Compression and Decompression", () => {
        nullResponse_test(compressToEncodedURIComponent, decompressFromEncodedURIComponent, test_null);
        emptyResponse_test(compressToEncodedURIComponent, decompressFromEncodedURIComponent, test_empty);
        undefinedResponse_test(compressToEncodedURIComponent, decompressFromEncodedURIComponent, test_undefined);
        utf16Response_test(compressToEncodedURIComponent, decompressFromEncodedURIComponent, test_allUtf16);
        helloWorld_test(compressToEncodedURIComponent, decompressFromEncodedURIComponent, test_hw);
        repeatingString_test(compressToEncodedURIComponent, decompressFromEncodedURIComponent, test_repeat);
        randomString_test(compressToEncodedURIComponent, decompressFromEncodedURIComponent);

        const test_longString = test_longString_fn(); // Unique per run
        const compressedLongString = compressToEncodedURIComponent(test_longString);

        longString_test(compressToEncodedURIComponent, decompressFromEncodedURIComponent, test_longString, compressedLongString);

        allCharsUrlSafe_test(compressToEncodedURIComponent, decompressFromEncodedURIComponent, test_longString, compressedLongString);
        interchangableChars_test(decompressFromEncodedURIComponent, test_tattooSource, test_tattooEncodedURIComponent);

        compressKnownString_test(compressToEncodedURIComponent, test_tattooSource, test_tattooEncodedURIComponentPlus);
        decompressKnownString_test(decompressFromEncodedURIComponent, test_tattooSource, test_tattooEncodedURIComponentPlus);
    });
}
