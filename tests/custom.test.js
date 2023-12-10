import { test, expect } from "vitest";
import {
    test_hw,
    test_repeat,
    test_tattooSource,
    test_longString,
    test_complicated,
} from "tests/testValues.js";
import { LZString } from "../src/main";

const hex    = "0123456789ABCDEF";
const base62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";


test(`Custom : Hello World  - something happens`, () => {
    expect(LZString.compressToCustom(test_hw, "0123456789")).not.toEqual(test_hw);
});



test(`Custom : Hello World  - hex : equals decompression of its compression`, () => {
    expect(LZString.decompressFromCustom(LZString.compressToCustom(test_hw, hex), hex)).toEqual(test_hw);
});

test(`Custom : repeat       - hex : equals decompression of its compression`, () => {
    expect(LZString.decompressFromCustom(LZString.compressToCustom(test_repeat, hex), hex)).toEqual(test_repeat);
});

test(`Custom : tattooSource - hex : equals decompression of its compression`, () => {
    expect(LZString.decompressFromCustom(LZString.compressToCustom(test_tattooSource, hex), hex)).toEqual(test_tattooSource);
});

test(`Custom : complicated  - hex : equals decompression of its compression`, () => {
    expect(LZString.decompressFromCustom(LZString.compressToCustom(test_complicated, hex), hex)).toEqual(test_complicated);
});



test(`Custom : Hello World  - base62 : equals decompression of its compression`, () => {
    expect(LZString.decompressFromCustom(LZString.compressToCustom(test_hw, base62), base62)).toEqual(test_hw);
});

test(`Custom : repeat       - base62 : equals decompression of its compression`, () => {
    expect(LZString.decompressFromCustom(LZString.compressToCustom(test_repeat, base62), base62)).toEqual(test_repeat);
});

test(`Custom : tattooSource - base62 : equals decompression of its compression`, () => {
    expect(LZString.decompressFromCustom(LZString.compressToCustom(test_tattooSource, base62), base62)).toEqual(test_tattooSource);
});

test(`Custom : longString   - base62 : equals decompression of its compression`, () => {
    let str = test_longString();
    expect(LZString.decompressFromCustom(LZString.compressToCustom(str, base62), base62)).toEqual(str);
});

test(`Custom : complicated  - base62 : equals decompression of its compression`, () => {
    expect(LZString.decompressFromCustom(LZString.compressToCustom(test_complicated, base62), base62)).toEqual(test_complicated);
});
