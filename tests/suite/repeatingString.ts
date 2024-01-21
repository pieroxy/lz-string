import { expect, test } from "vitest";

export function repeatingString_test(compressFunc, decompressFunc, data) {
    test(`Repeating String`, () => {
        const compressedRepeat = compressFunc(data);

        expect(compressedRepeat).toEqual(compressFunc(data));
        expect(compressedRepeat).not.toEqual(data);
        expect(compressedRepeat.length).toBeLessThan(data.length);
        expect(decompressFunc(compressedRepeat)).toEqual(data);
    });
}
