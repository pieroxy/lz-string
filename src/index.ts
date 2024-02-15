/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { _compress } from "./_compress";
import { _decompress } from "./_decompress";
import { compressToBase64, decompressFromBase64 } from "./base64";
import {
    compressToCustom,
    customBase16Dict,
    customBase32Dict,
    customBase32HexDict,
    customBase36Dict,
    customBase58Dict,
    customBase62Dict,
    customBase64Dict,
    customBase95Dict,
    customSafeDict,
    decompressFromCustom,
    getCustomDictionary,
} from "./custom";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "./encodedURIComponent";
import { loadBinaryFile, saveBinaryFile } from "./node";
import { compress, decompress } from "./raw";
import {
    compressToUint8Array,
    convertFromUint8Array,
    convertToUint8Array,
    decompressFromUint8Array,
} from "./Uint8Array";
import { compressToUTF16, decompressFromUTF16 } from "./UTF16";

export default {
    _compress,
    _decompress,
    compress,
    compressToBase64,
    compressToCustom,
    compressToEncodedURIComponent,
    compressToUint8Array,
    compressToUTF16,
    convertFromUint8Array,
    convertToUint8Array,
    customSafeDict,
    customBase16Dict,
    customBase32Dict,
    customBase32HexDict,
    customBase36Dict,
    customBase58Dict,
    customBase62Dict,
    customBase64Dict,
    customBase95Dict,
    decompress,
    decompressFromBase64,
    decompressFromCustom,
    decompressFromEncodedURIComponent,
    decompressFromUint8Array,
    decompressFromUTF16,
    getCustomDictionary,
    loadBinaryFile,
    saveBinaryFile,
};
