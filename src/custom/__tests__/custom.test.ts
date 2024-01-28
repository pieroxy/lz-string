/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, test } from "vitest";

import { compressToCustom, decompressFromCustom } from "..";
import { runTestSet } from "../../__tests__/testFunctions";

describe("custom", () => {
    describe("hex", () => {
        const hex = "0123456789ABCDEF";
        const compress = (input: string | null) => compressToCustom(input, hex);
        const decompress = (input: string | null) => decompressFromCustom(input, hex);

        runTestSet<string>("", compress, decompress);
    });

    describe("23 letter heterogram", () => {
        const heterogram = "BlockyDwarfZingsTheJump";
        const compress = (input: string | null) => compressToCustom(input, heterogram);
        const decompress = (input: string | null) => decompressFromCustom(input, heterogram);

        runTestSet<string>("", compress, decompress);
    });

    describe("base62", () => {
        const base62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const compress = (input: string | null) => compressToCustom(input, base62);
        const decompress = (input: string | null) => decompressFromCustom(input, base62);

        runTestSet<string>("", compress, decompress);
    });

    describe("short dictionary", () => {
        const dict = "a";

        test(dict, ({ expect }) => {
            expect.soft(decompressFromCustom("any string", dict)).toEqual(null);
        });
    });
});
