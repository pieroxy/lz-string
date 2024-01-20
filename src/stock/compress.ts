import { _compress } from "../_compress";

export function compress(input: string | null) {
    if (input == null) return "";

    return _compress(input, 16, (a: number) => String.fromCharCode(a));
}
