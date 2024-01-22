/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

export interface DecompressionTracker {
    val: number;
    position: number;
    index: number;
}

export function _decompress(length: number, resetValue: number, getNextValue: (a: number) => number): string | null {
    const dictionary: string[] = [];
    let enlargeIn: number = 4;
    let dictSize: number = 4;
    let numBits: number = 3;
    let entry: string = "";
    const result: string[] = [];
    let i: number;
    let w: string;
    let bits: number;
    let resb: number;
    let maxpower: number;
    let power: number;
    let c: string | number;
    const data: DecompressionTracker = {
        val: getNextValue(0),
        position: resetValue,
        index: 1,
    };

    for (i = 0; i < 3; i += 1) {
        dictionary[i] = String(i);
    }
    bits = 0;
    maxpower = Math.pow(2, 2);
    power = 1;
    while (power != maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
    }
    switch (bits) {
        case 0:
            bits = 0;
            maxpower = Math.pow(2, 8);
            power = 1;
            while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }
            c = String.fromCharCode(bits);
            break;
        case 1:
            bits = 0;
            maxpower = Math.pow(2, 16);
            power = 1;
            while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }
            c = String.fromCharCode(bits);
            break;
        case 2:
            return "";
    }
    if (c! === undefined) {
        throw new Error("No character found");
    }
    dictionary[3] = String(c);
    w = String(c);
    result.push(String(c));
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (data.index > length) {
            return "";
        }
        bits = 0;
        maxpower = Math.pow(2, numBits);
        power = 1;
        while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
        }
        switch ((c = bits)) {
            case 0:
                bits = 0;
                maxpower = Math.pow(2, 8);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                dictionary[dictSize++] = String.fromCharCode(bits);
                c = dictSize - 1;
                enlargeIn--;
                break;
            case 1:
                bits = 0;
                maxpower = Math.pow(2, 16);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                dictionary[dictSize++] = String.fromCharCode(bits);
                c = dictSize - 1;
                enlargeIn--;
                break;
            case 2:
                return result.join("");
        }
        if (enlargeIn == 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
        }
        if (dictionary[c]) {
            entry = String(dictionary[c]);
        } else {
            if (c === dictSize) {
                entry = w + w.charAt(0);
            } else {
                return null;
            }
        }
        result.push(entry);
        // Add w+entry[0] to the dictionary.
        dictionary[dictSize++] = w + entry.charAt(0);
        enlargeIn--;
        w = entry;
        if (enlargeIn == 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
        }
    }
}
