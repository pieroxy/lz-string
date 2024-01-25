/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { describe } from "vitest";
import { compressToBase64, compressToBetterBase64, compressToBase64URL } from ".";
import { decompressFromBase64, decompressFromBetterBase64, decompressFromBase64URL } from ".";
import { runNewerTestSet, runTestSet } from "../__tests__/testFunctions";

describe("base64", () => {
    runTestSet<string>("base64", compressToBase64, decompressFromBase64);
});
describe("betterbase64", () => {
    runNewerTestSet<string>("betterbase64", compressToBetterBase64, decompressFromBetterBase64);
});
describe("base64url", () => {
    runNewerTestSet<string>("base64url", compressToBase64URL, decompressFromBase64URL);
});
