/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { describe } from "vitest";
import LZString from "../dist/index.cjs";
import { runAllTests } from "./testFunctions";

describe("dist/index.cjs (commonjs)", () => {
    runAllTests(LZString);
});
