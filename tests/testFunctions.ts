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

/**
 * Expected to be called from within a `describe`. This will pass the name and
 * compress / decompress pair, as well as a "known good" value for all output
 * methods.
 */
export function runAllTests (implementation: typeof LZString) {
    runTestSet("Stock Compression and Decompression", implementation.compress, implementation.decompress);

    runTestSet(
        "Base64 Compression and Decompression",
        implementation.compressToBase64,
        implementation.decompressFromBase64,
        test_tattooBase64,
    );

    runTestSet(
        "BetterBase64 Compression and Decompression",
        implementation.compressToBetterBase64,
        implementation.decompressFromBetterBase64,
        test_tattooBetterBase64,
    );

    runTestSet(
        "Base64URL Compression and Decompression",
        implementation.compressToBase64URL,
        implementation.decompressFromBase64URL,
        test_tattooBase64URL,
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
function runTestSet (desc: string, compressFunc, decompressFunc, compressedTattoo?, testEncodedURI?: boolean) {
    describe(desc, () => {
        nullResponse_test(compressFunc, decompressFunc, test_null);
        emptyResponse_test(compressFunc, decompressFunc, test_empty);
        undefinedResponse_test(compressFunc, decompressFunc, test_undefined);
        utf16Response_test(compressFunc, decompressFunc, test_allUtf16);
        helloWorld_test(compressFunc, decompressFunc, test_hw);
        repeatingString_test(compressFunc, decompressFunc, test_repeat);
        randomString_test(compressFunc, decompressFunc);

        const test_longString = test_longString_fn(); // Unique per run
        const compressedLongString = compressFunc(test_longString);

        longString_test(compressFunc, decompressFunc, test_longString, compressedLongString);

        if (testEncodedURI) {
            allCharsUrlSafe_test(compressFunc, decompressFunc, test_longString, compressedLongString);
            interchangableChars_test(decompressFunc, test_tattooSource, test_tattooEncodedURIComponent);
        }

        if (compressedTattoo) {
            compressKnownString_test(compressFunc, test_tattooSource, test_tattooEncodedURIComponent);
            decompressKnownString_test(decompressFunc, test_tattooSource, test_tattooEncodedURIComponent);
        }
    });
}
