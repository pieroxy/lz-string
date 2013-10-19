var compressionTests = function(compress, decompress) {
    it('compresses and decompresses  "Hello world!"', function() {
        var compressed = LZString[compress]('Hello world!');
        expect(compressed).not.toBe('Hello world!');
        var decompressed = LZString[decompress](compressed);
        expect(decompressed).toBe('Hello world!');
    });

    it('compresses and decompresses null', function() {
        var compressed = LZString[compress](null);
        expect(compressed).toBe('');
        expect(typeof compressed).toBe(typeof '');
        var decompressed = LZString[decompress](compressed);
        expect(decompressed).toBe(null);
    });

    it('compresses and decompresses undefined', function() {
        var compressed = LZString[compress]();
        expect(compressed).toBe('');
        expect(typeof compressed).toBe(typeof '');
        var decompressed = LZString[decompress](compressed);
        expect(decompressed).toBe(null);
    });

    it('decompresses null', function() {
        var decompressed = LZString[decompress](null);
        expect(decompressed).toBe('');
    });

    it('compresses and decompresses an empty string', function() {
        var compressed = LZString[compress]('');
        expect(compressed).not.toBe('');
        expect(typeof compressed).toBe(typeof '');
        var decompressed = LZString[decompress](compressed);
        expect(decompressed).toBe('');
    });

    it('compresses and decompresses all printable UTF-16 characters',
        function() {
        var testString = '';
        var i;
        for (i = 32; i < 127; ++i) {
            testString += String.fromCharCode(i);
        }
        for (i = 128 + 32; i < 55296; ++i) {
            testString += String.fromCharCode(i);
        }
        for (i = 63744; i < 65536; ++i) {
            testString += String.fromCharCode(i);
        }
        //console.log(testString);
        var compressed = LZString[compress](testString);
        expect(compressed).not.toBe(testString);
        var decompressed = LZString[decompress](compressed);
        expect(decompressed).toBe(testString);
    });

    it('compresses and decompresses a string that repeats',
        function() {
        var testString = 'aaaaabaaaaacaaaaadaaaaaeaaaaa';
        var compressed = LZString[compress](testString);
        expect(compressed).not.toBe(testString);
        expect(compressed.length).toBeLessThan(testString.length);
        var decompressed = LZString[decompress](compressed);
        expect(decompressed).toBe(testString);
    });
};

describe('LZString', function() {
    describe('base 64', function() {
        compressionTests('compressToBase64',
                         'decompressFromBase64');
    });
    describe('UTF-16', function() {
        compressionTests('compressToUTF16',
                         'decompressFromUTF16');
    });
});
