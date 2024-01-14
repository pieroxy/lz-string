import { test, expect } from "vitest";
import {
  test_allUtf16,
  test_empty,
  test_hw,
  test_longString,
  test_null,
  test_repeat,
  test_tattooBase64,
  test_tattooEncodedURIComponent,
  test_tattooEncodedURIComponentPlus,
  test_tattooSource,
  test_tattooUint8Array,
  test_tattooUTF16,
  test_undefined,
} from "./testValues.ts";
import { LZString } from "../src/main";

export function runTestSet(desc, compressFunc, decompressFunc, compressedTattoo) {
  test(`${desc} : Hello World`, () => {
    expect(compressFunc(test_hw)).not.toEqual(test_hw);
    expect(decompressFunc(compressFunc(test_hw))).toEqual(test_hw);
  });

  test(`${desc} : null`, () => {
    const compressedNull = compressFunc(test_null);

    compressedNull instanceof Uint8Array
      ? expect(compressedNull.length).toBe(0)
      : expect(compressedNull).toEqual("");
  });

  test(`${desc} : empty string`, () => {
    const compressedEmpty = compressFunc(test_empty);

    expect(compressedEmpty).not.toEqual("");
    compressedEmpty instanceof Uint8Array
      ? expect(compressedEmpty.length).not.toBe(0)
      : expect(typeof compressedEmpty).toBe("string");
    expect(decompressFunc(compressFunc(test_empty))).toEqual(test_empty);
  });

  test(`${desc} : undefined`, () => {
    const compressedUndefined = compressFunc(test_undefined);

    compressedUndefined instanceof Uint8Array
      ? expect(compressedUndefined.length).toBe(0)
      : expect(compressedUndefined).toBe("");
  });

  test(`${desc} : utf16`, () => {
    const allUtf = test_allUtf16();

    expect(compressFunc(allUtf)).not.toEqual(allUtf);
    expect(decompressFunc(compressFunc(allUtf))).toEqual(allUtf);
  });

  test(`${desc} : Repeating String`, () => {
    expect(compressFunc(test_repeat)).not.toEqual(test_repeat);
    expect(compressFunc(test_repeat).length).toBeLessThan(test_repeat.length);
    expect(decompressFunc(compressFunc(test_repeat))).toEqual(test_repeat);
  });

  const longString = test_longString();
  const compressedLongString = compressFunc(longString);

  test(`${desc} : Long String`, () => {
    expect(compressedLongString).not.toEqual(longString);
    expect(compressedLongString.length).toBeLessThan(longString.length);
    expect(decompressFunc(compressedLongString)).toEqual(longString);
  });

  if (desc === "EncodedURIComponent Compression and Decompression") {
    console.info("Special EncodedURIComponent Tests");

    test(`${desc} : All chars are URL safe`, () => {
      expect(compressedLongString.indexOf("=")).toBe(-1);
      expect(compressedLongString.indexOf("/")).toBe(-1);
      expect(decompressFunc(compressedLongString)).toBe(longString);
    });

    test(`${desc} : + and ' ' are interchangeable in decompression`, () => {
      expect(test_tattooSource).toEqual(
        decompressFunc(test_tattooEncodedURIComponent),
      );
    });

    if (desc.startsWith("Stock")) {
      /* Do Nothing */
    } else {
      console.info("Tattoo Tests");

      test(`${desc} : Compression`, () => {
        expect(compressFunc(test_tattooSource)).toEqual(compressedTattoo);
      });
      test(`${desc} : Decompression`, () => {
        expect(decompressFunc(compressedTattoo)).toEqual(test_tattooSource);
      });
    }
  }
}

runTestSet(
  "Stock Compression and Decompression",
  LZString.compress,
  LZString.decompress,
  "",
);

runTestSet(
  "Base64 Compression and Decompression",
  LZString.compressToBase64,
  LZString.decompressFromBase64,
  test_tattooBase64,
);

runTestSet(
  "UTF16 Compression and Decompression",
  LZString.compressToUTF16,
  LZString.decompressFromUTF16,
  test_tattooUTF16,
);

runTestSet(
  "Uint8Array Compression and Decompression",
  LZString.compressToUint8Array,
  LZString.decompressFromUint8Array,
  test_tattooUint8Array,
);

runTestSet(
  "EncodedURIComponent Compression and Decompression",
  LZString.compressToEncodedURIComponent,
  LZString.decompressFromEncodedURIComponent,
  test_tattooEncodedURIComponentPlus,
);
