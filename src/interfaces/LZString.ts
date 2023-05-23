export interface LZString {
  _compress: (uncompressed: string, bitsPerChar: number, getCharFromInt: (value: number) => string) => string
  _decompress: (length: number, resetValue: number, getNextValue: (index: number) => number) => string | null
  compress: (uncompressed: string) => string
  decompress: (compressed: string) => string | null

  compressToBase64 : (input: string) => string
  decompressFromBase64 : (input: string) => string | null
  compressToUTF16 : (input: string) => string
  decompressFromUTF16: (compressed: string) => string | null
  compressToUint8Array: (uncompressed: string) => Uint8Array
  decompressFromUint8Array: (compressed: Uint8Array) => string | null
  compressToEncodedURIComponent: (input: string) => string
  decompressFromEncodedURIComponent: (input: string) => string | null
}
