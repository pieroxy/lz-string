import { describe, it, expect } from "vitest";
import { isCompressed } from "..";
import { compress } from "../../raw";
import { compressToBase64 } from "../../base64";
import { compressToEncodedURIComponent } from "../../encodedURIComponent";
import { compressToUTF16 } from "../../UTF16";
import { compressToUint8Array } from "../../Uint8Array";

describe("isCompressed()", () => {
    const raw = "Hello World";

    it("returns false for raw string", () => {
        expect(isCompressed(raw)).toBe(false);
    });

    it("detects compress()", () => {
        const c = compress(raw);
        expect(isCompressed(c)).toBe(true);
    });

    it("detects compressToBase64()", () => {
        const c = compressToBase64(raw);
        expect(isCompressed(c)).toBe(true);
    });

    it("detects compressToEncodedURIComponent()", () => {
        const c = compressToEncodedURIComponent(raw);
        expect(isCompressed(c)).toBe(true);
    });

    it("detects compressToUTF16()", () => {
        const c = compressToUTF16(raw);
        expect(isCompressed(c)).toBe(true);
    });

    it("detects compressToUint8Array()", () => {
        const c = compressToUint8Array(raw);
        expect(isCompressed(c)).toBe(true);
    });
});
