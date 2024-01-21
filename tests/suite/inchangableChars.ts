import { expect, test } from "vitest";

export function interchangableChars_test(decompressFunc, data, compressedData) {
    test(`+ and ' ' are interchangeable in decompression`, () => {
        expect(data).toEqual(decompressFunc(compressedData));
    });
}
