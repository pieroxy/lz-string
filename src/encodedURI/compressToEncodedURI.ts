import { _compress } from "../_compress";
import keyStrUriSafe from "./keyStrUriSafe";
import { deprecated } from "../utils/misc";

export function compressToEncodedURIComponent(input: string | null) {
    deprecated("compressToEncodedURIComponent()", "v2.0.0", { replacement: "compressToBase64URL()"})
    if (input == null) return "";

    return _compress(input, 6, (a) => keyStrUriSafe.charAt(a));
}
