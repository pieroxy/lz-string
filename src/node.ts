/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import { writeFileSync, readFileSync } from "node:fs";
import { convertToUint8Array, convertFromUint8Array } from "./Uint8Array";

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
