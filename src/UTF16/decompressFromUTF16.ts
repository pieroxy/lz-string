/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { _decompress } from "../_decompress";

export function decompressFromUTF16(compressed: string | null) {
    if (compressed == null) return "";
    if (compressed == "") return null;

    return _decompress(compressed.length, 16384, (index) => compressed.charCodeAt(index) - 32);
}
