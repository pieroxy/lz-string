import { expect, test } from "vitest";

export function emptyShouldBeEmptyResponse_test(compressFunc, decompressFunc, data) {
    test(`"" (empty string)`, () => {
        const compressedEmpty = compressFunc(data);

        expect(compressedEmpty).toEqual(compressFunc(data));
        expect(compressedEmpty).toEqual("");
        compressedEmpty instanceof Uint8Array
            ? expect(compressedEmpty.length).not.toBe(0)
            : expect(typeof compressedEmpty).toBe("string");
        expect(decompressFunc(compressedEmpty)).toEqual(data);
    });
}

export function emptyShouldNotBeEmptyResponse_test(compressFunc, decompressFunc, data) {
    test(`"" (empty string)`, () => {
        const compressedEmpty = compressFunc(data);

        expect(compressedEmpty).toEqual(compressFunc(data));
        expect(compressedEmpty).not.toEqual("");
        compressedEmpty instanceof Uint8Array
            ? expect(compressedEmpty.length).not.toBe(0)
            : expect(typeof compressedEmpty).toBe("string");
        expect(decompressFunc(compressedEmpty)).toEqual(data);
    });
}
