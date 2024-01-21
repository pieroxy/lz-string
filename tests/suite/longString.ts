import { expect, test } from "vitest";

export function longString_test(compressFunc, decompressFunc, data, compressedData) {
    test(`Long String`, () => {
        expect(compressedData).toEqual(compressFunc(data));
        expect(compressedData).not.toEqual(data);
        expect(compressedData.length).toBeLessThan(data.length);
        expect(decompressFunc(compressedData)).toEqual(data);
    });
}
