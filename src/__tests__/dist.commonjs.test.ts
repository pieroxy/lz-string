/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { existsSync } from "fs";
import { join } from "path";
import { describe } from "vitest";

import { testMockedLZString } from "./testFunctions";

const filePath = join(__dirname, "../../dist/index.cjs");

if (existsSync(filePath)) {
    testMockedLZString(filePath, "commonjs");
} else {
    describe.skip(`No built file: ${filePath}`);
}
