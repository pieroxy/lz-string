/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, test } from "vitest";

import index from "../index";

describe("index.ts", () => {
    test("was the change deliberate?", ({ expect }) => {
        expect(index).toMatchSnapshot();
    });
});
