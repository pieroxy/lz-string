/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

export type Dictionary = Record<string, number>;
export type DictionaryCollection = Record<string, Dictionary>;

const baseReverseDic: DictionaryCollection = {};

export function getBaseValue(alphabet: string, character: string): number {
    if (!baseReverseDic[alphabet]) {
        baseReverseDic[alphabet] = {};
        for (let i = 0; i < alphabet.length; i++) {
            baseReverseDic[alphabet][alphabet.charAt(i)] = i;
        }
    }
    return baseReverseDic[alphabet][character];
}
