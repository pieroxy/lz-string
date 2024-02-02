/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { PathOrFileDescriptor, readFileSync, writeFileSync } from "fs";

import { convertFromUint8Array, convertToUint8Array } from "./Uint8Array";

/**
 * Binary safe file saving for NodeJS.
 */
export function saveBinaryFile(fileName: PathOrFileDescriptor, data: string | Uint8Array) {
    writeFileSync(fileName, typeof data === "string" ? convertToUint8Array(data)! : data, null);
}

/**
 * Binary safe file loading for NodeJS.
 */
export function loadBinaryFile(fileName: PathOrFileDescriptor) {
    return convertFromUint8Array(readFileSync(fileName, null));
}
