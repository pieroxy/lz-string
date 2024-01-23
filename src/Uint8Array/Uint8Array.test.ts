/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { describe } from "vitest";
import { compressToUint8Array, decompressFromUint8Array } from ".";
import { runTestSet } from "../__tests__/testFunctions";

describe("Uint8Array", () => {
    runTestSet("", compressToUint8Array, decompressFromUint8Array);
});
