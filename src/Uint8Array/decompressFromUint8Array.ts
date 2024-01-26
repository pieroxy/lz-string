/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { decompress } from "../raw/decompress";
import { convertFromUint8Array } from "./utils";

export function decompressFromUint8Array(compressed: Uint8Array | null): string | null {
    if (compressed === null || compressed === undefined) {
        return decompress(compressed);
    } else {
        return decompress(convertFromUint8Array(compressed));
    }
}
