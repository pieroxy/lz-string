import { expect, test } from "vitest";

export function utf16Response_test(compressFunc, decompressFunc, data) {
    test(`utf16`, () => {
        const compressedUtf16 = compressFunc(data);

        expect(compressedUtf16).toEqual(compressFunc(data));
        expect(compressedUtf16).not.toEqual(data);
        expect(decompressFunc(compressedUtf16)).toEqual(data);
    });
}
