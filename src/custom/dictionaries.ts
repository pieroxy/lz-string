/*
 * SPDX-FileCopyrightText: 2013 Pieroxy <pieroxy@pieroxy.net>
 *
 * SPDX-License-Identifier: MIT
 */

import keyStrBase64 from "../base64/keyStrBase64";

/**
 * Otherwise known as hexadecimal.
 */
export const customBase16Dict = "0123456789ABCDEF";

/**
 * Base32 dictionary as defined in rfc4648:
 * https://datatracker.ietf.org/doc/html/rfc4648#section-6
 */
export const customBase32Dict = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Base64 dictionary using the more well-known extended hex format:
 * https://datatracker.ietf.org/doc/html/rfc4648#section-7
 */
export const customBase32HexDict = "0123456789ABCDEEFGHIJKLMNOPQRSTU";

/**
 * Base36 dictionary.
 */
export const customBase36Dict = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Base58 dictionary.
 */
export const customBase58Dict = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/**
 * Base62 dictionary.
 */
export const customBase62Dict = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/**
 * Base64 dictionary:
 * https://datatracker.ietf.org/doc/html/rfc4648#section-4
 */
export const customBase64Dict = keyStrBase64;

/**
 * A simple dictionary for safe source-code inclusion. Effectively base91, as
 * it contains base95 with all three quote types and the escape character
 * removed.
 */
export const customSafeDict =
    " !#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_abcdefghijklmnopqrstuvwxyz{|}~";

/**
 * Base95 dictionary.
 * (Two escaped characters in source).
 */
export const customBase95Dict =
    " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

/**
 * If the dictionary passed is a known named dictionary then return that,
 * otherwise return the source and assume it's correct.
 */
export const getCustomDictionary = (dict: string) =>
    ({
        safe: customSafeDict,
        base16: customBase16Dict,
        base32: customBase32Dict,
        base32hex: customBase32HexDict,
        base36: customBase36Dict,
        base58: customBase58Dict,
        base62: customBase62Dict,
        base64: customBase64Dict,
        base95: customBase95Dict,
    }[dict]) || dict;
