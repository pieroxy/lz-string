/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { _compress } from "../_compress";
import { keyStrBase64URL } from "./keyStrBase64URL";

export function compressToBase64URL(input: string): string {
    if (!input) {
        return "";
    }
    return _compress(input, 6, (a) => keyStrBase64URL.charAt(a));
}
