var compressionTests = function(compress, decompress, uint8array_mode) {
    it('compresses and decompresses  "Hello world!"', function() {
        var compressed = compress('Hello world!');
        expect(compressed).not.toBe('Hello world!');
        var decompressed = decompress(compressed);
        expect(decompressed).toBe('Hello world!');
    });

    it('compresses and decompresses null', function() {
        var compressed = compress(null);
        if (uint8array_mode===false){
            expect(compressed).toBe('');
            expect(typeof compressed).toBe(typeof '');
        } else {    //uint8array
            expect(compressed instanceof Uint8Array).toBe(true);
            expect(compressed.length).toBe(0);  //empty array
        }
        var decompressed = decompress(compressed);
        expect(decompressed).toBe(null);
    });

    it('compresses and decompresses undefined', function() {
        var compressed = compress();
        if (uint8array_mode===false){
            expect(compressed).toBe('');
            expect(typeof compressed).toBe(typeof '');
        } else {    //uint8array
            expect(compressed instanceof Uint8Array).toBe(true);
            expect(compressed.length).toBe(0);  //empty array
        }
        var decompressed = decompress(compressed);
        expect(decompressed).toBe(null);
    });

    it('decompresses null', function() {
        var decompressed = decompress(null);
        expect(decompressed).toBe('');
    });

    it('compresses and decompresses an empty string', function() {
        var compressed = compress('');
        if (uint8array_mode===false){
            expect(compressed).not.toBe('');
            expect(typeof compressed).toBe(typeof '');
        } else {    //uint8array
            expect(compressed instanceof Uint8Array).toBe(true);
            expect(compressed.length).not.toBe(0);  //not an empty array when compress
        }
        var decompressed = decompress(compressed);
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
        var compressed = compress(testString);
        expect(compressed).not.toBe(testString);
        var decompressed = decompress(compressed);
        expect(decompressed).toBe(testString);
    });

    it('compresses and decompresses a string that repeats',
        function() {
        var testString = 'aaaaabaaaaacaaaaadaaaaaeaaaaa';
        var compressed = compress(testString);
        expect(compressed).not.toBe(testString);
        expect(compressed.length).toBeLessThan(testString.length);
        var decompressed = decompress(compressed);
        expect(decompressed).toBe(testString);
    });

    it('compresses and decompresses a long string',
        function() {
        var testString = '';
        var i;
        for (i=0 ; i<1000 ; i++)
          testString += Math.random() + " ";

        var compressed = compress(testString);
        expect(compressed).not.toBe(testString);
        expect(compressed.length).toBeLessThan(testString.length);
        var decompressed = decompress(compressed);
        expect(decompressed).toBe(testString);
    });
};

describe('LZString', function() {
    describe('base 64', function() {
        compressionTests(LZString.compressToBase64
                         ,LZString.decompressFromBase64
                         ,false //uint8array_mode: false
                         );
    });
    describe('UTF-16', function() {
        compressionTests(LZString.compressToUTF16
                         ,LZString.decompressFromUTF16
                         ,false //uint8array_mode: false
                         );
    });
    describe('URI Encoded', function() {
        compressionTests(LZString.compressToEncodedURIComponent
                         ,LZString.decompressFromEncodedURIComponent
                         ,false //uint8array_mode: false
                         );
    });
    describe('uint8array', function() {
        compressionTests(LZString.compressToUint8Array
                         ,LZString.decompressFromUint8Array
                         ,true  //uint8array_mode: true
                         );
    });
});


describe('Specific URL Encoded', function() {
    it("check that all chars are URL safe", function() {
        var testString = '';
        var i;
        for (i=0 ; i<1000 ; i++)
          testString += Math.random() + " ";

        var compressed = LZString.compressToEncodedURIComponent(testString);
        expect(compressed.indexOf("=")).toBe(-1);
        expect(compressed.indexOf("/")).toBe(-1);
        var decompressed = LZString.decompressFromEncodedURIComponent(compressed);
        expect(decompressed).toBe(testString);
    });
});
