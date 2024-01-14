import { _compress } from "../_compress";

export function compress(uncompressed: string): string {
    return _compress(uncompressed, 16, (a: number) => String.fromCharCode(a));
}
