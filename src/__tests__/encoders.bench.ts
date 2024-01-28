/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { bench, describe } from "vitest";

import { compressToBase64, decompressFromBase64 } from "../base64";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "../encodedURIComponent";
import { compress, decompress } from "../raw";
import { compressToUint8Array, decompressFromUint8Array } from "../Uint8Array";
import { compressToUTF16, decompressFromUTF16 } from "../UTF16";
import { getTestData, testDataFiles } from "./testFunctions";

for (const path in testDataFiles) {
    const name = testDataFiles[path];
    const rawData = getTestData(path);

    describe.sequential(`compress ${name}`, () => {
        bench("base64", () => {
            compressToBase64(rawData);
        });
        bench("encodedURIComponent", () => {
            compressToEncodedURIComponent(rawData);
        });
        bench("raw", () => {
            compress(rawData);
        });
        bench("Uint8Array", () => {
            compressToUint8Array(rawData);
        });
        bench("UTF16", () => {
            compressToUTF16(rawData);
        });
    });

    describe.sequential(`decompress ${name}`, () => {
        const compressedBase64 = compressToBase64(rawData);
        const compressedEncodedURIComponent = compressToEncodedURIComponent(rawData);
        const compressedRaw = compress(rawData);
        const compressedUint8Array = compressToUint8Array(rawData);
        const compressedUTF16 = compressToUTF16(rawData);

        bench("base64", () => {
            decompressFromBase64(compressedBase64);
        });
        bench("encodedURIComponent", () => {
            decompressFromEncodedURIComponent(compressedEncodedURIComponent);
        });
        bench("raw", () => {
            decompress(compressedRaw);
        });
        bench("Uint8Array", () => {
            decompressFromUint8Array(compressedUint8Array);
        });
        bench("UTF16", () => {
            decompressFromUTF16(compressedUTF16);
        });
    });
}
