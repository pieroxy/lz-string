/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { describe } from "vitest";

import { compressToBase64, decompressFromBase64 } from "..";
import { runTestSet } from "../../__tests__/testFunctions";

describe("base64", () => {
    runTestSet<string>("base64", compressToBase64, decompressFromBase64);
});
