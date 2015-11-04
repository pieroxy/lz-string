// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
var LZString = (function() {
// private property
var f = String.fromCharCode,
  keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",
  baseReverseDic = {};

function getBaseValue(alphabet, character) {
  if (!baseReverseDic[alphabet]) {
    baseReverseDic[alphabet] = {};
    for (var i = 0; i < alphabet.length; i++) {
      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    }
  }
  return baseReverseDic[alphabet][character];
}

return {
  compressToBase64: function(input) {
    if (input === null) return "";
    var res = this._compress(input, 6, function(a) {
      return keyStrBase64.charAt(a);
    });
    while (res.length % 4 > 0) { // To produce valid Base64
      res += "=";
    }
    return res;
  },

  decompressFromBase64: function(input) {
    if (input === null) return "";
    if (input === "") return null;
    return this._decompress(input.length, 32, function(index) {
      return getBaseValue(keyStrBase64, input.charAt(index));
    });
  },

  compressToUTF16: function(input) {
    if (input === null) return "";
    return this._compress(input, 15, function(a) {
      return f(a + 32);
    }) + " ";
  },

  decompressFromUTF16: function(compressed) {
    if (compressed === null) return "";
    if (compressed === "") return null;
    return this._decompress(compressed.length, 16384, function(index) {
      return compressed.charCodeAt(index) - 32;
    });
  },

  //compress into uint8array (UCS-2 big endian format)
  compressToUint8Array: function(uncompressed) {
    var compressed = this.compress(uncompressed);
    var buf = new Uint8Array(compressed.length * 2); // 2 bytes per character

    for (var i = 0, l = compressed.length; i < l; i++) {
      var current_value = compressed.charCodeAt(i);
      buf[i * 2] = current_value >>> 8;
      buf[i * 2 + 1] = current_value % 256;
    }
    return buf;
  },

  //decompress from uint8array (UCS-2 big endian format)
  decompressFromUint8Array: function(compressed) {
    if (compressed === null || compressed === undefined) {
      return this.decompress(compressed);
    } else {
      var buf = new Array(compressed.length / 2); // 2 bytes per character
      for (var i = 0, l = buf.length; i < l; i++) {
        buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
      }

      var result = "";
      buf.forEach(function(c) {
        result += f(c);
      });
      return this.decompress(result);
    }
  },


  //compress into a string that is already URI encoded
  compressToEncodedURIComponent: function(input) {
    if (input === null) return "";
    return this._compress(input, 6, function(a) {
      return keyStrUriSafe.charAt(a);
    });
  },

  //decompress from an output of compressToEncodedURIComponent
  decompressFromEncodedURIComponent: function(input) {
    if (input === null) return "";
    if (input === "") return null;
    input = input.replace(/ /g, "+");
    return this._decompress(input.length, 32, function(index) {
      return getBaseValue(keyStrUriSafe, input.charAt(index));
    });
  },

  compress: function(uncompressed) {
    return this._compress(uncompressed, 16, function(a) {
      return f(a);
    });
  },
  _compress: function(uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed === null) return "";
    var value,
      context_dictionary = {},
      context_dictionaryToCreate = {},
      context_c = "",
      context_wc = "",
      context_w = "",
      context_enlargeIn = 2, // Compensate for the first entry which should not count
      context_dictSize = 3,
      context_numBits = 2,
      context_data = [],
      context_data_val = 0,
      context_data_position = 0;

    var func1 = function(){
      if (context_data_position == bitsPerChar - 1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }
    },
      func2 = function(iterate){
        for (var i = 0; i < iterate; i++) {
          context_data_val = (context_data_val << 1) | (value & 1);
          func1();
          value >>= 1;
        }
      },
      func3 = function(){
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
          var isLessThan256 = context_w.charCodeAt(0) < 256;
          if(!isLessThan256) value = 1;
          for (var i = 0; i < context_numBits; i++) {
            context_data_val = isLessThan256 ? (context_data_val << 1) : (context_data_val << 1) | value;
            func1();
            if(!isLessThan256) value = 0;
          }
          value = context_w.charCodeAt(0);
          func2(isLessThan256 ? 8 : 16);
          context_enlargeIn = --context_enlargeIn || Math.pow(2, context_numBits++);
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          func2(context_numBits);
        }
        context_enlargeIn = --context_enlargeIn || Math.pow(2, context_numBits++);
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      };

    for (var i = 0; i < uncompressed.length; i++) {
      context_c = uncompressed.charAt(i);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }

      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
        context_w = context_wc;
      } else {
        func3();
      }
    }

    // Output the code for w.
    if (context_w !== "") func3();

    // Mark the end of the stream
    value = 2;
    func2(context_numBits);

    // Flush the last char
    context_data.push(getCharFromInt(context_data_val << (bitsPerChar - context_data_position)));
    return context_data.join('');
  },

  decompress: function(compressed) {
    if (compressed === null) return "";
    if (compressed === "") return null;
    return this._decompress(compressed.length, 32768, function(index) {
      return compressed.charCodeAt(index);
    });
  },

  _decompress: function(length, resetValue, getNextValue) {
    var dictionary = [0, 1, 2],
      next,
      enlargeIn = 4,
      dictSize = 4,
      numBits = 3,
      result = [],
      w,
      c,
      data = {
        val: getNextValue(0),
        position: resetValue,
        index: 1
      };

    var getBits = function(maxPow){
      var bits = 0;
      for (var p = 0; p < maxPow; p++) {
        var resb = data.val & data.position;
        data.position >>= 1;
        if (data.position === 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0) * (1 << p);
      }
      return bits;
    };

    if((next = getBits(2)) === 2) return "";
    if(next < 2) c = f(getBits(next ? 16 : 8));

    result.push(w = dictionary[3] = c);
    while (true) {
      if (data.index > length) return "";

      if ((c = getBits(numBits)) === 2) return result.join('');
      if (c < 2) {
        dictionary[dictSize++] = f(getBits(c ? 16 : 8));
        c = dictSize - 1;
        enlargeIn--;
      }

      enlargeIn = enlargeIn || Math.pow(2, numBits++);

      if (!dictionary[c] && c !== dictSize) return null;
      var entry = dictionary[c] || w + w.charAt(0);
      result.push(entry);

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;

      w = entry;

      enlargeIn = enlargeIn || Math.pow(2, numBits++);
    }
  }
};
})();

if (typeof define === 'function' && define.amd) {
  define(function() {
    return LZString;
  });
} else if (typeof module !== 'undefined' && module !== null) {
  module.exports = LZString;
}
