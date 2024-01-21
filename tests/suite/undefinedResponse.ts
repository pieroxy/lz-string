import { expect, test } from "vitest";

export function undefinedResponse_test(compressFunc, decompressFunc, data) {
    test(`undefined`, () => {
        const compressedUndefined = compressFunc(data);

        compressedUndefined instanceof Uint8Array
            ? expect(compressedUndefined.length).toBe(0)
            : expect(compressedUndefined).toBe("");
    });
}
