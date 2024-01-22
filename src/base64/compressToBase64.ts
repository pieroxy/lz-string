/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { _compress } from "../_compress";
import keyStrBase64 from "./keyStrBase64";

export function compressToBase64(input: string | null): string {
    if (input == null) {
        return "";
    }

    const res = _compress(input, 6, (a) => keyStrBase64.charAt(a));

    // To produce valid Base64
    switch (res.length % 4) {
        default: // When could this happen ?
        case 0:
            return res;
        case 1:
            return res + "===";
        case 2:
            return res + "==";
        case 3:
            return res + "=";
    }
}
