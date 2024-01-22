/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, test } from "vitest";
import { compressToCustom, decompressFromCustom } from ".";
import { test_longString_fn } from "../__tests__/testFunctions";
import {
    test_hw,
    test_repeat,
    test_tattooSource,
    test_complicated,
} from "../../tests/testValues";

describe("custom", () => {
    const hex    = "0123456789ABCDEF";
    const base62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    test(`Custom : Hello World  - something happens`, () => {
        expect(compressToCustom(test_hw, "0123456789")).not.toEqual(test_hw);
    });
    
    
    
    test(`Custom : Hello World  - hex : equals decompression of its compression`, () => {
        expect(decompressFromCustom(compressToCustom(test_hw, hex), hex)).toEqual(test_hw);
    });
    
    test(`Custom : repeat       - hex : equals decompression of its compression`, () => {
        expect(decompressFromCustom(compressToCustom(test_repeat, hex), hex)).toEqual(test_repeat);
    });
    
    test(`Custom : tattooSource - hex : equals decompression of its compression`, () => {
        expect(decompressFromCustom(compressToCustom(test_tattooSource, hex), hex)).toEqual(test_tattooSource);
    });
    
    test(`Custom : complicated  - hex : equals decompression of its compression`, () => {
        expect(decompressFromCustom(compressToCustom(test_complicated, hex), hex)).toEqual(test_complicated);
    });
    
    
    
    test(`Custom : Hello World  - base62 : equals decompression of its compression`, () => {
        expect(decompressFromCustom(compressToCustom(test_hw, base62), base62)).toEqual(test_hw);
    });
    
    test(`Custom : repeat       - base62 : equals decompression of its compression`, () => {
        expect(decompressFromCustom(compressToCustom(test_repeat, base62), base62)).toEqual(test_repeat);
    });
    
    test(`Custom : tattooSource - base62 : equals decompression of its compression`, () => {
        expect(decompressFromCustom(compressToCustom(test_tattooSource, base62), base62)).toEqual(test_tattooSource);
    });
    
    test(`Custom : longString   - base62 : equals decompression of its compression`, () => {
        const str = test_longString_fn()
        expect(decompressFromCustom(compressToCustom(str, base62), base62)).toEqual(str);
    });
    
    test(`Custom : complicated  - base62 : equals decompression of its compression`, () => {
        expect(decompressFromCustom(compressToCustom(test_complicated, base62), base62)).toEqual(test_complicated);
    });
});
