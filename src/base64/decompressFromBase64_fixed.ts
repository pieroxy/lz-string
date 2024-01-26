/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { _decompress } from "../_decompress";
import { getBaseValue } from "../getBaseValue";
import keyStrBase64 from "./keyStrBase64";

export function decompressFromBase64_fixed(input: string): string {
    if (!input) {
        return "";
    }
    const res = _decompress(input.length, 32, (index) => getBaseValue(keyStrBase64, input.charAt(index)));
    return res || "";
}
