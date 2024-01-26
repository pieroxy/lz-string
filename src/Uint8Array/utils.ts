/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

/**
 * Converts a string to a Uint8Array, needed for saving on NodeJS, but might
 * also be useful for data transfer.
 *
 * This is binary safe rather than utf8 like TextDecoder.
 */
export function convertToUint8Array(data: string | null, forceEven?: boolean) {
    if (typeof data === "string") {
        // Needs a single extra digit so not an even output length
        const isOdd = !forceEven && data.charCodeAt(data.length - 1) % 256 === 0;
        const buf = new Uint8Array(data.length * 2 - (isOdd ? 1 : 0)); // 2 bytes per character

        for (let i = 0; i < data.length; i++) {
            const current_value = data.charCodeAt(i);

            buf[i * 2] = current_value >>> 8;
            if (!isOdd || i < data.length - 1) {
                buf[i * 2 + 1] = current_value % 256;
            }
        }

        return buf;
    }

    return data;
}

/**
 * Converts a Uint8Array to a string, needed for loading on NodeJS, but might
 * also be useful for data transfer.
 *
 * This is binary safe rather than utf8 like TextEncoder.
 */
export function convertFromUint8Array(data: Uint8Array) {
    // There might be an odd number of digits
    const length = Math.floor(data.byteLength / 2);
    const arr = [];

    for (let i = 0; i < length; i++) {
        arr.push(String.fromCharCode(data[i * 2] * 256 + data[i * 2 + 1]));
    }
    if (data.byteLength & 1) {
        arr.push(String.fromCharCode(data[data.byteLength - 1] * 256));
    }
    return arr.join("");
}
