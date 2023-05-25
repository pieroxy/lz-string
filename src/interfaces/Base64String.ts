export interface Base64String {
  compress : (input: string) => string
  decompress : (input: string) => string

  compressToUTF16: (input: string) => string
  decompressFromUTF16: (input: string) => string
  _keyStr: string
}
