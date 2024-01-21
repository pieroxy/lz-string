import { _compress } from "../_compress";
import keyStrBase64 from "./keyStrBase64";
import { _decompress } from "../_decompress";
import { getBaseValue } from "../getBaseValue";

export function compressToBetterBase64(input: string): string {
    if (!input) {
        return "";
    }
    const res = _compress(input, 6, (a) => keyStrBase64.charAt(a));

    // To produce valid Base64
    switch (res.length % 3) {
        case 0:
            return res;
        case 1:
            return res + "==";
        case 2:
            return res + "=";
        default: // When could this happen ?
            console.warn("Something in compressToBetterBase64() is very very wrong.");
            return "";
    }

}

export function decompressFromBetterBase64(input: string): string {
    if (!input) {
        return "";
    }
    const res = _decompress(input.length, 32, (index) => getBaseValue(keyStrBase64, input.charAt(index)));
    return res || "";
}
