/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { _decompress } from "../_decompress";

export function decompress(compressed: string | null) {
    if (compressed == null) return "";
    if (compressed == "") return null;

    return _decompress(compressed.length, 32768, (index) => compressed.charCodeAt(index));
}
