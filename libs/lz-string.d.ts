export declare const compressToBase64: (input: string) => string;
export declare const decompressFromBase64: (input: string) => string;
export declare const compressToUTF16: (input: string) => string;
export declare const decompressFromUTF16: (compressed: string) => string;
/**
 * compress into uint8array (UCS-2 big endian format)
 */
export declare const compressToUint8Array: (uncompressed: string) => Uint8Array;
/**
 * decompress from uint8array (UCS-2 big endian format)
 */
export declare const decompressFromUint8Array: (compressed: Uint8Array) => string;
/**
 * compress into a string that is already URI encoded
 */
export declare const compressToEncodedURIComponent: (input: string) => string;
/**
 * decompress from an output of compressToEncodedURIComponent
 */
export declare const decompressFromEncodedURIComponent: (input: string) => string;
export declare const compress: (uncompressed: string) => string;
export declare const decompress: (compressed: string) => string;
