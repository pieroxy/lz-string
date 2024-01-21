import { expect, test } from "vitest";

export function compressKnownString_test(compressFunc, data, compressedData) {
    test(`expected compression result`, () => {
        expect(compressFunc(data)).toEqual(compressedData);
    });
}
