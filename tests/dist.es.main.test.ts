/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { describe } from "vitest";
import LZString from "../dist/index.js";
import { runAllTests } from "./testFunctions";

describe("dist/index.js (esmodule)", () => {
    runAllTests(LZString);
});
