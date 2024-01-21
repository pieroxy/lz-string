import { expect, test } from "vitest";

export function decompressKnownString_test(decompressFunc, data, compressedData) {
    test(`expected decompression result`, () => {
        expect(decompressFunc(compressedData)).toEqual(data);
    });
}
