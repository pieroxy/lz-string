import { compress } from "../stock/compress";

export function compressToCustom (uncompressed: string, dict: string): string {
    const compressed: string = compress(uncompressed);
    const charsPerUnicodeChar: number = Math.ceil(Math.log(65536) / Math.log(dict.length));
    let res: string = "";
    
    for (let i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
      let current_value = compressed.charCodeAt(i);

      for (let j = charsPerUnicodeChar-1; j >= 0; j--) {
        const selector = Math.floor(current_value / Math.pow(dict.length, j));
        current_value = current_value % Math.pow(dict.length, j);
        res += dict.charAt(selector);
      }
    }

    return res;
}