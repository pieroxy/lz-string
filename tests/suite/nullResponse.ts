import { expect, test } from "vitest";

export function nullShouldNotBeNullResponse_test(compressFunc, decompressFunc, data) {
    test(`null`, () => {
        const compressedNull = compressFunc(data);

        compressedNull instanceof Uint8Array
            ? expect(compressedNull.length).toBe(0)
            : expect(compressedNull).toEqual("");
    });
}

export function nullShouldBeNullResponse_test(compressFunc, decompressFunc, data) {
    test(`null`, () => {
        const compressedNull = compressFunc(data);
        expect(compressedNull).toEqual(null);
    });
}
