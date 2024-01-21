import { expect, test } from "vitest";

export function helloWorld_test(compressFunc, decompressFunc, data) {
    test(`"Hello World"`, () => {
        const compressedHw = compressFunc(data);

        expect(compressedHw).toEqual(compressFunc(data));
        expect(compressedHw).not.toEqual(data);
        expect(decompressFunc(compressedHw)).toEqual(data);
    });
}




