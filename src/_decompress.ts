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

export function _decompress(length: number, resetValue: number, getNextValue: (a: number) => number) {
    const dictionary: string[] = [];
    const result: string[] = [];
    const data: DecompressionTracker = {
        val: getNextValue(0),
        position: resetValue,
        index: 1,
    };
    let enlargeIn = 4;
    let dictSize = 4;
    let numBits = 3;
    let entry = "";
    let c: string | number;
    let bits = 0;
    let maxpower = Math.pow(2, 2);
    let power = 1;

    for (let i = 0; i < 3; i += 1) {
        dictionary[i] = String(i);
    }

    while (power != maxpower) {
        const resb = data.val & data.position;

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
                const resb = data.val & data.position;

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
                const resb = data.val & data.position;

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
    let w = String(c);
    result.push(String(c));
    const forever = true;

    while (forever) {
        if (data.index > length) {
            return "";
        }
        bits = 0;
        maxpower = Math.pow(2, numBits);
        power = 1;
        while (power != maxpower) {
            const resb = data.val & data.position;

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
                    const resb = data.val & data.position;

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
                    const resb = data.val & data.position;

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
