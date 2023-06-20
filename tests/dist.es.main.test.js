import {
  test_tattooBase64,
  test_tattooEncodedURIComponentPlus,
  test_tattooUint8Array,
  test_tattooUTF16,
} from "tests/testValues.js";
import { LZString } from "dist/index.es.js";
import { runTestSet } from "tests/testFunctions.js";

runTestSet(
  "DIST/ES | Stock Compression and Decompression",
  LZString.compress,
  LZString.decompress,
  "",
);
runTestSet(
  "DIST/ES | Base64 Compression and Decompression",
  LZString.compressToBase64,
  LZString.decompressFromBase64,
  test_tattooBase64,
);
runTestSet(
  "DIST/ES | UTF16 Compression and Decompression",
  LZString.compressToUTF16,
  LZString.decompressFromUTF16,
  test_tattooUTF16,
);
runTestSet(
  "DIST/ES | Uint8Array Compression and Decompression",
  LZString.compressToUint8Array,
  LZString.decompressFromUint8Array,
  test_tattooUint8Array,
);
runTestSet(
  "DIST/ES | EncodedURIComponent Compression and Decompression",
  LZString.compressToEncodedURIComponent,
  LZString.decompressFromEncodedURIComponent,
  test_tattooEncodedURIComponentPlus,
);
