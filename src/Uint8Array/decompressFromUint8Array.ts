import { decompress } from "../stock/decompress";

export function decompressFromUint8Array(compressed: Uint8Array | null): string | null {
    if (compressed === null || compressed === undefined) {
        return decompress(compressed);
    } else {
        const buf: number[] = new Array(compressed.length / 2); // 2 bytes per character

        for (let i = 0, TotalLen = buf.length; i < TotalLen; i++) {
            buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
        }

        const result: string[] = [];

        buf.forEach(function (c) {
            result.push(String.fromCharCode(c));
        });

        return decompress(result.join(""));
    }
}
