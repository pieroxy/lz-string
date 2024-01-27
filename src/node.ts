/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { readFileSync, writeFileSync } from "fs";

import { convertFromUint8Array, convertToUint8Array } from "./Uint8Array";

/**
 * Binary safe file saving for NodeJS.
 */
export function saveBinaryFile(fileName: string, data: string | Uint8Array) {
    writeFileSync(fileName, typeof data === "string" ? convertToUint8Array(data)! : data, null);
}

/**
 * Binary safe file loading for NodeJS.
 */
export function loadBinaryFile(fileName: string) {
    return convertFromUint8Array(readFileSync(fileName, null));
}
