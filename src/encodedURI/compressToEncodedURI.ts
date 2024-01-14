import { _compress } from "../_compress";
import keyStrUriSafe from "./keyStrUriSafe";

export function compressToEncodedURIComponent(input: string): string {
    if (input == null) return "";

    return _compress(input, 6, function (a) {
        return keyStrUriSafe.charAt(a);
    });
}
