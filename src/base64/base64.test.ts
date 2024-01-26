/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { describe } from "vitest";
import { compressToBase64, compressToBetterBase64 } from ".";
import { decompressFromBase64, decompressFromBetterBase64 } from ".";
import { runNewerTestSet, runTestSet } from "../__tests__/testFunctions";

describe("base64", () => {
    runTestSet<string>("base64", compressToBase64, decompressFromBase64);
});
describe("betterbase64", () => {
    runNewerTestSet<string>("betterbase64", compressToBetterBase64, decompressFromBetterBase64);
});
