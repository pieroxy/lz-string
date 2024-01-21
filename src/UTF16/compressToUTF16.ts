/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { _compress } from "../_compress";

export function compressToUTF16(input: string | null) {
    if (input == null) return "";

    return _compress(input, 15, (a) => String.fromCharCode(a + 32)) + " ";
}
