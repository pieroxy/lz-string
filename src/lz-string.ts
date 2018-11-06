// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
const f: any = String.fromCharCode;
const keyStrBase64: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const keyStrUriSafe: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";

const baseReverseDic: any = {};

const getBaseValue = (alphabet: string, character: string): number => {
  if (!baseReverseDic[alphabet]) {
    baseReverseDic[alphabet] = {};
    for (let i: number = 0; i < alphabet.length; i++) {
      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    }
  }
  return baseReverseDic[alphabet][character];
};

export const compressToBase64 = (input: string): string => {
  if (input === null || input === undefined) {
    return "";
  }

  const res: string = _compress(input, 6, (a: number): string => {
    return keyStrBase64.charAt(a);
  });

  switch (res.length % 4) { // To produce valid Base64
    default: // When could this happen ?
    case 0 : return res;
    case 1 : return res + "===";
    case 2 : return res + "==";
    case 3 : return res + "=";
  }
};

export const decompressFromBase64 = (input: string): string => {
  if (input === null || input === undefined) {
    return "";
  }
  if (input === "") {
    return null;
  }

  return _decompress(input.length, 32, (index: number): number => {
    return getBaseValue(keyStrBase64, input.charAt(index));
  });
};

export const compressToUTF16 = (input: string): string => {
  if (input === null || input === undefined) {
    return "";
  }
  return _compress(input, 15, (a: number): string => {
    return f(a + 32);
  }) + " ";
};

export const decompressFromUTF16 = (compressed: string): string => {
  if (compressed === null || compressed === undefined) {
    return "";
  }
  if (compressed === "") {
    return null;
  }
  return _decompress(compressed.length, 16384, (index: number): number => {
    return compressed.charCodeAt(index) - 32;
  });
};

/**
 * compress into uint8array (UCS-2 big endian format)
 */
export const compressToUint8Array = (uncompressed: string): Uint8Array => {
  const compressed: any = compress(uncompressed);
  const buf: Uint8Array = new Uint8Array(compressed.length * 2);  // 2 bytes per character

  let current_value: number;
  const TotalLen: number = compressed.length;
  for (let i: number = 0; i < TotalLen; i++) {
    current_value = compressed.charCodeAt(i);
    buf[i * 2] = current_value >>> 8;
    buf[i * 2 + 1] = current_value % 256;
  }

  return buf;
};

/**
 * decompress from uint8array (UCS-2 big endian format)
 */
export const decompressFromUint8Array = (compressed: Uint8Array): string => {
  if (compressed === null || compressed === undefined) {
    return decompress(null);
  } else {
    const buf: Array<any> = new Array(compressed.length / 2); // 2 bytes per character
    const TotalLen: number = compressed.length;
    for (let i: number = 0; i < TotalLen; i++) {
      buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
    }

    const result: Array<string> = [];
    buf.forEach((c: number): void => {
      result.push(f(c));
    });
    return decompress(result.join(""));
  }
};

/**
 * compress into a string that is already URI encoded
 */
export const compressToEncodedURIComponent = (input: string): string => {
  if (input === null || input === undefined) {
    return "";
  }

  return _compress(input, 6, (a: number): string => {
    return keyStrUriSafe.charAt(a);
  });
};

/**
 * decompress from an output of compressToEncodedURIComponent
 */
export const decompressFromEncodedURIComponent = (input: string): string => {
  if (input === null || input === undefined) {
    return "";
  }
  if (input === "") {
    return null;
  }
  input = input.replace(/ /g, "+");
  return _decompress(input.length, 32, (index: number): number => {
    return getBaseValue(keyStrUriSafe, input.charAt(index));
  });
};

export const compress = (uncompressed: string): string => {
  return _compress(uncompressed, 16, (a: number): string => {
    return f(a);
  });
};

/**
 * Provide similar ES6-Map class
 * @hidden
 */
class BaseMap {

  private dict: any = {};

  public delete(key: string): any {
    if (key in this.dict) {
      delete this.dict[key];
      return true;
    } else {
      return false;
    }
  }
  public get(key: string): any {
    return this.dict[key];
  }
  public has(key: string): boolean {
    return key in this.dict;
  }
  public set(key: string, value: any): void {
    this.dict[key] = value;
  }

}

const getMapOrObject = (): any => {
  return (typeof Map === "undefined") ? new BaseMap() : new Map();
};

const _compress = (
    uncompressed: string,
    bitsPerChar: number,
    getCharFromInt: (a: number) => string): string => {
  if (uncompressed === null || uncompressed === undefined) {
    return "";
  }

  let i: number;
  let value: any;
  const context_dictionary: any = getMapOrObject();
  const context_dictionaryToCreate = getMapOrObject();
  let context_c: string;
  let context_wc: string;
  let context_w: string = "";
  let context_enlargeIn: number = 2; // Compensate for the first entry which should not count
  let context_dictSize: number = 3;
  let context_numBits: number = 2;
  const context_data: Array<string> = [];
  let context_data_val: number = 0;
  let context_data_position: number = 0;
  let ii: number;

  for (ii = 0; ii < uncompressed.length; ii += 1) {
    context_c = uncompressed.charAt(ii);
    if (!(context_dictionary.has(context_c))) {
      context_dictionary.set(context_c, context_dictSize++);
      context_dictionaryToCreate.set(context_c, true);
    }

    context_wc = context_w + context_c;
    if (context_dictionary.has(context_wc)) {
      context_w = context_wc;
    } else {
      if (context_dictionaryToCreate.has(context_w)) {
        if (context_w.charCodeAt(0) < 256) {
          for (i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position === bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i = 0; i < 8; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position === bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position === bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i = 0; i < 16; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position === bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn === 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        context_dictionaryToCreate.delete(context_w);
      } else {
        value = context_dictionary.get(context_w);
        for (i = 0; i < context_numBits; i++) {
          context_data_val = (context_data_val << 1) | (value & 1);
          if (context_data_position === bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
      }
      context_enlargeIn--;
      if (context_enlargeIn === 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
      // Add wc to the dictionary.
      context_dictionary.set(context_wc, context_dictSize++);
      context_w = String(context_c);
    }
  }


  // Output the code for w.
  if (context_w !== "") {
    if (context_dictionaryToCreate.has(context_w)) {
      if (context_w.charCodeAt(0) < 256) {
        for (i = 0; i < context_numBits; i++) {
          context_data_val = (context_data_val << 1);
          if (context_data_position === bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
        }
        value = context_w.charCodeAt(0);
        for (i = 0; i < 8 ; i++) {
          context_data_val = (context_data_val << 1) | (value & 1);
          if (context_data_position === bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
      } else {
        value = 1;
        for (i = 0; i < context_numBits; i++) {
          context_data_val = (context_data_val << 1) | value;
          if (context_data_position === bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = 0;
        }
        value = context_w.charCodeAt(0);
        for (i = 0; i < 16; i++) {
          context_data_val = (context_data_val << 1) | (value & 1);
          if (context_data_position === bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
      }
      context_enlargeIn--;
      if (context_enlargeIn === 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
      context_dictionaryToCreate.delete(context_w);
    } else {
      value = context_dictionary.get(context_w);
      for (i = 0; i < context_numBits; i++) {
        context_data_val = (context_data_val << 1) | (value & 1);
        if (context_data_position === bitsPerChar - 1) {
          context_data_position = 0;
          context_data.push(getCharFromInt(context_data_val));
          context_data_val = 0;
        } else {
          context_data_position++;
        }
        value = value >> 1;
      }


    }
    context_enlargeIn--;
    if (context_enlargeIn === 0) {
      context_enlargeIn = Math.pow(2, context_numBits);
      context_numBits++;
    }
  }

  // Mark the end of the stream
  value = 2;
  for (i = 0; i < context_numBits; i++) {
    context_data_val = (context_data_val << 1) | (value & 1);
    if (context_data_position === bitsPerChar - 1) {
      context_data_position = 0;
      context_data.push(getCharFromInt(context_data_val));
      context_data_val = 0;
    } else {
      context_data_position++;
    }
    value = value >> 1;
  }

  // Flush the last char
  while (true) {
    context_data_val = (context_data_val << 1);
    if (context_data_position === bitsPerChar - 1) {
      context_data.push(getCharFromInt(context_data_val));
      break;
    } else {
      context_data_position++;
    }
  }
  return context_data.join("");
};

export const decompress = (compressed: string): string => {
  if (compressed === null || compressed === undefined) {
    return "";
  }
  if (compressed === "") {
    return null;
  }

  return _decompress(compressed.length, 32768, (index: number): number => {
    return compressed.charCodeAt(index);
  });
};

const _decompress = (
    length: number,
    resetValue: number,
    getNextValue: (index: number) => number): string => {


  const dictionary: Array<any> = [];
  let next: any;
  let enlargeIn: number = 4;
  let dictSize: number = 4;
  let numBits: number = 3;
  let entry: string = "";
  const result: Array<any> = [];
  let i: number;
  let w: string;
  let bits: number;
  let resb: number;
  let maxpower: number;
  let power: number;
  let c: string;
  let cN: number;
  const data: any = {
    index: 1,
    position: resetValue,
    val: getNextValue(0),
  };

  for (i = 0; i < 3; i += 1) {
    dictionary[i] = i;
  }


  bits = 0;
  maxpower = Math.pow(2, 2);
  power = 1;
  while (power !== maxpower) {
    resb = data.val & data.position;
    data.position >>= 1;
    if (data.position === 0) {
      data.position = resetValue;
      data.val = getNextValue(data.index++);
    }
    bits |= (resb > 0 ? 1 : 0) * power;
    power <<= 1;
  }

  switch (next = bits) {
    case 0:
      bits = 0;
      maxpower = Math.pow(2, 8);
      power = 1;
      while (power !== maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position === 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }
      c = f(bits);
      break;
    case 1:
      bits = 0;
      maxpower = Math.pow(2, 16);
      power = 1;
      while (power !== maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position === 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }
      c = f(bits);
      break;
    case 2:
      return "";
  }

  dictionary[3] = c;
  w = c;
  result.push(c);
  while (true) {
    if (data.index > length) {
      return "";
    }

    bits = 0;
    maxpower = Math.pow(2, numBits);
    power = 1;
    while (power !== maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position === 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb > 0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch (cN = bits) {
      case 0:
        bits = 0;
        maxpower = Math.pow(2, 8);
        power = 1;
        while (power !== maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position === 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }

        dictionary[dictSize++] = f(bits);
        cN = dictSize - 1;
        enlargeIn--;
        break;

      case 1:
        bits = 0;
        maxpower = Math.pow(2, 16);
        power = 1;
        while (power !== maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position === 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        dictionary[dictSize++] = f(bits);
        cN = dictSize - 1;
        enlargeIn--;
        break;


      case 2:
        return result.join("");
    }

    if (enlargeIn === 0) {
      enlargeIn = Math.pow(2, numBits);
      numBits++;
    }

    if (dictionary[cN]) {
      entry = dictionary[cN];
    } else {
      if (cN === dictSize) {
        entry = w + w.charAt(0);
      } else {
        return null;
      }
    }
    result.push(entry);

    // Add w + entry[0] to the dictionary.
    dictionary[dictSize++] = w + entry.charAt(0);
    enlargeIn--;

    w = entry;

    if (enlargeIn === 0) {
      enlargeIn = Math.pow(2, numBits);
      numBits++;
    }

  }

};

const LZString = {
  compress,
  compressToBase64,
  compressToEncodedURIComponent,
  compressToUTF16,
  compressToUint8Array,
  decompress,
  decompressFromBase64,
  decompressFromEncodedURIComponent,
  decompressFromUTF16,
  decompressFromUint8Array,
};
exports.LZString = LZString;

/* tslint:disable */
declare let angular: any;
declare let define: any;
declare let module: any;

if (typeof define === "function" && define.amd) {
  // AMD-js
  define(() => {
    return LZString;
  });
} else if (typeof module !== "undefined" && module != null ) {
  module.exports = LZString;

} else if (typeof angular !== "undefined") {
  // Angular.js
  angular.module("LZString", [])
    .factory("LZString", () => {
      return LZString;
    });
}
