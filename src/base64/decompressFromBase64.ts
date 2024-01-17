import { _decompress } from "../_decompress";
import { getBaseValue } from "../getBaseValue";
import keyStrBase64 from "./keyStrBase64";
import { deprecated } from "../utils/misc";

export function decompressFromBase64(input: string | null) {
    deprecated("decompressFromBase64()", "v2.0.0", { replacement: "decompressFromBetterBase64()"})
    if (input == null) return "";
    if (input == "") return null;

    return _decompress(input.length, 32, (index) => getBaseValue(keyStrBase64, input.charAt(index)));
}
