/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { _decompress } from "../_decompress";
import { getBaseValue } from "../getBaseValue";
import keyStrUriSafe from "./keyStrUriSafe";

export function decompressFromEncodedURIComponent(input: string | null) {
    if (input == null) return "";
    if (input == "") return null;

    input = input.replace(/ /g, "+");

    return _decompress(input.length, 32, (index) => getBaseValue(keyStrUriSafe, input!.charAt(index)));
}
