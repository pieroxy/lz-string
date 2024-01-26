/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { decompress } from "../raw/decompress";

export function decompressFromCustom(compressed: string | null, dict: string): string | null {
    if (compressed == null) return "";
    if (compressed == "") return null;
    if (dict.length < 2) return null;

    const charsPerUnicodeChar: number = Math.ceil(Math.log(65536) / Math.log(dict.length));

    if (compressed.length % charsPerUnicodeChar != 0) return null;

    let res: string = "";
    let current_value;
    let index;

    for (let i = 0, TotalLen = compressed.length; i < TotalLen; i = i + charsPerUnicodeChar) {
        current_value = 0;

        for (let j = 0; j < charsPerUnicodeChar; j++) {
            index = dict.indexOf(compressed[i + j]);
            current_value = current_value + index * Math.pow(dict.length, charsPerUnicodeChar - 1 - j);
        }

        res = res + String.fromCharCode(current_value);
    }

    return decompress(res);
}
