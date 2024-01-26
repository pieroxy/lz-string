/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { describe } from "vitest";
import { compressToBase64URL } from ".";
import { decompressFromBase64URL } from ".";
import { runNewerTestSet } from "../__tests__/testFunctions";

describe("base64url", () => {
    runNewerTestSet<string>("base64url", compressToBase64URL, decompressFromBase64URL);
});
