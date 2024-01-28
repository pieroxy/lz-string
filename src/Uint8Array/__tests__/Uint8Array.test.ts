/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { describe } from "vitest";

import { compressToUint8Array, convertFromUint8Array, convertToUint8Array, decompressFromUint8Array } from "..";
import { runTestSet } from "../../__tests__/testFunctions";

describe("Uint8Array", () => {
    const safeCompressToUint8Array = (data: string | null) => convertFromUint8Array(compressToUint8Array(data));
    const safeDecompressFromUint8Array = (data: string | null) => decompressFromUint8Array(convertToUint8Array(data));

    runTestSet("", safeCompressToUint8Array, safeDecompressFromUint8Array);
});
