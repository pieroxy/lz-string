// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.5

import { _compress } from "./_compress";
import { _decompress } from "./_decompress";
import { compressToBase64, decompressFromBase64, compressToBetterBase64, decompressFromBetterBase64 } from "./base64";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "./encodedURI";
import { compress, decompress } from "./stock";
import { compressToUint8Array, decompressFromUint8Array } from "./Uint8Array";
import { compressToUTF16, decompressFromUTF16 } from "./UTF16";

export default {
    _compress,
    _decompress,

    compress,
    decompress,

    compressToBase64,
    decompressFromBase64,
    compressToBetterBase64,
    decompressFromBetterBase64,

    compressToEncodedURIComponent,
    decompressFromEncodedURIComponent,

    compressToUint8Array,
    decompressFromUint8Array,

    compressToUTF16,
    decompressFromUTF16,
};
