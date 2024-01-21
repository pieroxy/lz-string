import { expect, test } from "vitest";

export function nullResponse_test(compressFunc, decompressFunc, data) {
    test(`null`, () => {
        const compressedNull = compressFunc(data);

        compressedNull instanceof Uint8Array
            ? expect(compressedNull.length).toBe(0)
            : expect(compressedNull).toEqual("");
    });
}
