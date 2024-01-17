import { decompressFromBase64 } from "./decompressFromBase64";
import { compressToBase64 } from "./compressToBase64";

export function compressToBetterBase64(input: string): string {
    return compressToBase64(input) || "";
}

export function decompressFromBetterBase64(input: string): string {
    return decompressFromBase64(input) || "";
}
