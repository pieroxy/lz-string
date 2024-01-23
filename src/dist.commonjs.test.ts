/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { join } from "path";
import { testMockedLZString } from "./__tests__/testFunctions";

testMockedLZString(join(__dirname, "../dist/index.cjs"), "commonjs");
