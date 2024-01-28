/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { describe } from "vitest";

import { compress, decompress } from "..";
import { runTestSet } from "../../__tests__/testFunctions";

describe("raw", () => {
    runTestSet("", compress, decompress);
});
