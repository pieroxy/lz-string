/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, test } from "vitest";

import * as index from "../index";

describe("raw/index.ts", () => {
    test("was the change deliberate?", ({ expect }) => {
        expect(index).toMatchSnapshot();
    });
});
