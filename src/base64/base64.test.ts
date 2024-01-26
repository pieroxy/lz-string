/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { describe } from "vitest";
import { compressToBase64, compressToBase64_fixed } from ".";
import { decompressFromBase64, decompressFromBase64_fixed } from ".";
import { runNewerTestSet, runTestSet } from "../__tests__/testFunctions";

describe("base64", () => {
    runTestSet<string>("base64", compressToBase64, decompressFromBase64);
});
describe("betterbase64", () => {
    runNewerTestSet<string>("betterbase64", compressToBase64_fixed, decompressFromBase64_fixed);
});
