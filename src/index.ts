/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { _compress } from "./_compress";
import { _decompress } from "./_decompress";
import {
    compressToBase64,
    decompressFromBase64,
    compressToBetterBase64,
    decompressFromBetterBase64,
} from "./base64";
import {
    compressToBase64URL,
    decompressFromBase64URL,
} from "./base64URL";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "./encodedURIComponent";
import { compress, decompress } from "./stock";
import { compressToUint8Array, decompressFromUint8Array } from "./Uint8Array";
import { compressToUTF16, decompressFromUTF16 } from "./UTF16";
import { compressToCustom, decompressFromCustom } from "./custom";

export default {
    _compress,
    _decompress,

    compress,
    decompress,

    compressToBase64,
    decompressFromBase64,
    compressToBetterBase64,
    decompressFromBetterBase64,
    
    compressToBase64URL,
    decompressFromBase64URL,

    compressToEncodedURIComponent,
    decompressFromEncodedURIComponent,

    compressToUint8Array,
    decompressFromUint8Array,

    compressToUTF16,
    decompressFromUTF16,

    compressToCustom,
    decompressFromCustom,
};
