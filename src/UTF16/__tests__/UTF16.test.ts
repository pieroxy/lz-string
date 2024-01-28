/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { describe } from "vitest";

import { compressToUTF16, decompressFromUTF16 } from "..";
import { runTestSet } from "../../__tests__/testFunctions";

describe("UTF16", () => {
    runTestSet("utf16", compressToUTF16, decompressFromUTF16);
});
