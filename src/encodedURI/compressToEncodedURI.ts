import { _compress } from "../_compress";
import keyStrUriSafe from "./keyStrUriSafe";

export function compressToEncodedURIComponent(input: string | null) {
    if (input == null) return "";

    return _compress(input, 6, (a) => keyStrUriSafe.charAt(a));
}
