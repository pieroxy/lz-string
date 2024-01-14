import keyStrUriSafe from "./keyStrUriSafe";
import { _decompress } from "../_decompress";
import { getBaseValue } from "../getBaseValue";

export function decompressFromEncodedURIComponent(input: string | null) {
    if (input == null) return "";
    if (input == "") return null;

    input = input.replace(/ /g, "+");

    return _decompress(input.length, 32, (index) => getBaseValue(keyStrUriSafe, input!.charAt(index)));
}
