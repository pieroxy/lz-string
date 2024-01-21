import { expect, test } from "vitest";
import { test_randomString_fn } from "../testValues";

export function randomString_test(compressFunc, decompressFunc) {
// Note that this is designed to be uncompressible
    test(`Random String`, () => {
        const test_randomString = test_randomString_fn(); // Unique per test
        const compressedRandomString = compressFunc(test_randomString);

        expect(compressedRandomString).toEqual(compressFunc(test_randomString));
        expect(compressedRandomString).not.toEqual(test_randomString);
        expect(decompressFunc(compressedRandomString)).toEqual(test_randomString);
    });
}
