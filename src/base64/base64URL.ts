import { _compress } from "../_compress";
import { _decompress } from "../_decompress";
import { getBaseValue } from "../getBaseValue";

const keyStrBase64URL =  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

export function compressToBase64URL(input: string): string {
    if (!input) {
        return "";
    }
    return _compress(input, 6, (a) => keyStrBase64URL.charAt(a));
}

export function decompressFromBase64URL(input: string): string {
    if (!input) {
        return "";
    }
    const res = _decompress(input.length, 32, (index) => getBaseValue(keyStrBase64URL, input.charAt(index)));
    return res || "";
}
