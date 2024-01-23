/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { _compress } from "../_compress";

export function compress(input: string | null) {
    if (input == null) return "";

    return _compress(input, 16, (a: number) => String.fromCharCode(a));
}
