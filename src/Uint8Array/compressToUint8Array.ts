/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { compress } from "../raw/compress";

export function compressToUint8Array(uncompressed: string | null): Uint8Array {
    const compressed: string = compress(uncompressed);
    // We cannot use convertToUint8Array as that changes the behaviour to support odd length of output!
    const buf: Uint8Array = new Uint8Array(compressed.length * 2); // 2 bytes per character

    for (let i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
        const current_value = compressed.charCodeAt(i);
        buf[i * 2] = current_value >>> 8;
        buf[i * 2 + 1] = current_value % 256;
    }

    return buf;
}
