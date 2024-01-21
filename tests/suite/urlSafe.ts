import { expect, test } from "vitest";

export function allCharsUrlSafe_test(compressFunc, decompressFunc, data, compressedData) {
    test(`All chars are URL safe`, () => {
        expect(compressedData.indexOf("=")).toBe(-1);
        expect(compressedData.indexOf("/")).toBe(-1);
        expect(decompressFunc(compressedData)).toBe(data);
    });
}
