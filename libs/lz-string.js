// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
var LZString = (
  function () {

    // private property
    var f = String.fromCharCode,
      Base64CharArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split(''),
      UriSafeCharArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$".split(''),
      Base64ReverseDic = {},
      UriSafeReverseDic = {},
      i = 65;
    while (i--) {
      Base64ReverseDic[Base64CharArray[i].charCodeAt(0)] = i;
      UriSafeReverseDic[UriSafeCharArray[i].charCodeAt(0)] = i;
    }
    var getChar16Bits = function (a) { return f(a); },
      getCharFromBase64 = function (a) { return Base64CharArray[a]; },
      getCharFromURISafe = function (a) { return UriSafeCharArray[a]; },
      getCharFromUTF16 = function (a) { return f(a + 32); };

    var LZString = {
      compressToBase64: function (input) {
        if (input == null) return "";
        var res = LZString._compressToArray(input, 6, getCharFromBase64);
        // To produce valid Base64
        var i = res.length % 4;
        while (i--) {
          res.push("=");
        }

        return res.join('');
      },

      decompressFromBase64: function (input) {
        if (input == null) return "";
        if (input == "") return null;
        return LZString._decompress(input.length, 32, function (index) { return Base64ReverseDic[input.charCodeAt(index)]; });
      },

      compressToUTF16: function (input) {
        if (input == null) return "";
        var compressed = LZString._compressToArray(input, 15, getCharFromUTF16);
        compressed.push(" ");
        return compressed.join('');
      },

      decompressFromUTF16: function (compressed) {
        if (compressed == null) return "";
        if (compressed == "") return null;
        return LZString._decompress(compressed.length, 16384, function (index) { return compressed.charCodeAt(index) - 32; });
      },

      //compress into uint8array (UCS-2 big endian format)
      compressToUint8Array: function (uncompressed) {
        var compressed = LZString.compressToArray(uncompressed);
        var buf = new Uint8Array(compressed.length * 2); // 2 bytes per character

        for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
          var current_value = compressed[i].charCodeAt(0);
          buf[i * 2] = current_value >>> 8;
          buf[i * 2 + 1] = current_value & 0xFF;
        }
        return buf;
      },

      //decompress from uint8array (UCS-2 big endian format)
      decompressFromUint8Array: function (compressed) {
        if (compressed === null || compressed === undefined) {
          return LZString.decompressFromArray(compressed);
        } else if (compressed.length == 0) {
          return null;
        }
        return LZString._decompress(compressed.length, 128, function (index) { return compressed[index]; });
      },


      //compress into a string that is already URI encoded
      compressToEncodedURIComponent: function (input) {
        if (input == null) return "";
        return LZString._compressToArray(input, 6, getCharFromURISafe).join('');
      },

      //decompress from an output of compressToEncodedURIComponent
      decompressFromEncodedURIComponent: function (input) {
        if (input == null) return "";
        if (input == "") return null;
        input = input.replace(/ /g, "+");
        return LZString._decompress(input.length, 32, function (index) { return UriSafeReverseDic[input.charCodeAt(index)]; });
      },

      compress: function (uncompressed) {
        return LZString.compressToArray(uncompressed).join('');
      },
      compressToArray: function (uncompressed) {
        return LZString._compressToArray(uncompressed, 16, getChar16Bits);
      },
      _compressToArray: function (uncompressed, bitsPerChar, getCharFromInt) {
        if (uncompressed == null) return [];
        var i = 0, j = 0, value = 0,
          dictionary = {},
          dictionaryToCreate = {},
          c = 0,
          c0 = 2,
          node = dictionary,
          new_node = {},
          enlargeIn = 2, // Compensate for the first entry which should not count
          dictSize = 3,
          numBits = 2,
          data = [],
          data_val = 0,
          data_position = 0;

        for (j = 0; j < uncompressed.length; j++) {
          c = uncompressed.charCodeAt(j);
          c0 = c + 2;
          // Is c a new character that needs to
          // be stored at the root?
          if (dictionary[c0] == undefined) {
            new_node = {};
            new_node[0] = dictSize++;
            new_node[1] = c;
            dictionary[c0] = new_node;
            dictionaryToCreate[c] = true;
          }

          new_node = node[c0];
          if (new_node) {
            node = new_node;
          } else {
            value = node[1];
            if (dictionaryToCreate[value]) {
              if (value < 256) {
                // insert "new 8 bit charCode" token
                // into bitstream (value 0)
                for (i = 0; i < numBits; i++) {
                  data_val <<= 1;
                  if (++data_position == bitsPerChar) {
                    data_position = 0;
                    data.push(getCharFromInt(data_val));
                    data_val = 0;
                  }
                }
                // insert 8 bit charcode
                for (i = 0; i < 8; i++) {
                  data_val = value>>i & 1 | data_val<<1;
                  if (++data_position == bitsPerChar) {
                    data_position = 0;
                    data.push(getCharFromInt(data_val));
                    data_val = 0;
                  }
                }
              } else {
                // insert "new 16 bit charCode" token
                // into bitstream (value 1)
                for (i = 0; i < numBits; i++) {
                  data_val = 1>>i | data_val<<1;
                  if (++data_position == bitsPerChar) {
                    data_position = 0;
                    data.push(getCharFromInt(data_val));
                    data_val = 0;
                  }
                }
                // insert 16 bit charCode
                for (i = 0; i < 16; i++) {
                  data_val = value>>i & 1 | data_val<<1;
                  if (++data_position == bitsPerChar) {
                    data_position = 0;
                    data.push(getCharFromInt(data_val));
                    data_val = 0;
                  }
                }
              }
              if (--enlargeIn == 0) {
                enlargeIn = 1 << numBits++;
              }
              dictionaryToCreate[value] = false;
            } else {
              // insert dictionary token into bitstream
              value = node[0];
              for (i = 0; i < numBits; i++) {
                data_val = value>>i & 1 | data_val<<1;
                if (++data_position == bitsPerChar) {
                  data_position = 0;
                  data.push(getCharFromInt(data_val));
                  data_val = 0;
                }
              }
            }
            if (--enlargeIn == 0) {
              enlargeIn = 1 << numBits++;
            }
            // Add prefix to the dictionary.
            new_node = {};
            new_node[0] = dictSize++;
            new_node[1] = c;
            node[c0] = new_node;
            node = dictionary[c0];
          }
        }

        // Output the code for node.
        if (node !== undefined) {
          value = node[1];
          if (dictionaryToCreate[value]) {
            if (value < 256) {
              for (i = 0; i < numBits; i++) {
                data_val <<= 1;
                if (++data_position == bitsPerChar) {
                  data_position = 0;
                  data.push(getCharFromInt(data_val));
                  data_val = 0;
                }
              }
              for (i = 0; i < 8; i++) {
                data_val = value>>i & 1 | data_val<<1;
                if (++data_position == bitsPerChar) {
                  data_position = 0;
                  data.push(getCharFromInt(data_val));
                  data_val = 0;
                }
              }
            } else {
              for (i = 0; i < numBits; i++) {
                data_val = 1>>i | data_val<<1;
                if (++data_position == bitsPerChar) {
                  data_position = 0;
                  data.push(getCharFromInt(data_val));
                  data_val = 0;
                }
              }
              for (i = 0; i < 16; i++) {
                data_val = value>>i & 1 | data_val<<1;
                if (++data_position == bitsPerChar) {
                  data_position = 0;
                  data.push(getCharFromInt(data_val));
                  data_val = 0;
                }
              }
            }
            if (--enlargeIn == 0) {
              enlargeIn = 1 << numBits++;
            }
            dictionaryToCreate[value] = false;
          } else {
            value = node[0];
            for (i = 0; i < numBits; i++) {
              data_val = value>>i & 1 | data_val << 1;
              if (++data_position == bitsPerChar) {
                data_position = 0;
                data.push(getCharFromInt(data_val));
                data_val = 0;
              }
            }
          }

          if (--enlargeIn == 0) {
            enlargeIn = 1 << numBits++;
          }
        }

        // Mark the end of the stream
        for (i = 0; i < numBits; i++) {
          data_val = 2>>i & 1 | data_val<<1;
          if (++data_position == bitsPerChar) {
            data_position = 0;
            data.push(getCharFromInt(data_val));
            data_val = 0;
          }
        }

        // Flush the last char
        data_val <<= bitsPerChar - data_position;
        data.push(getCharFromInt(data_val));
        return data;
      },

      decompress: function (compressed) {
        if (compressed == null) return "";
        if (compressed == "") return null;
        return LZString._decompress(compressed.length, 32768, function (index) { return compressed.charCodeAt(index); });
      },

      decompressFromArray: function (compressed) {
        if (compressed == null) return "";
        if (compressed.length == 0) return null;
        return LZString._decompress(compressed.length, 32768, function (index) { return compressed[index].charCodeAt(0); });
      },

      _decompress: function (length, resetValue, getNextValue) {
        resetValue = Math.log2(resetValue) + 1;
        var dictionary = [0, 1, 2],
          enlargeIn = 4,
          dictSize = 4,
          numBits = 3,
          entry = "",
          result = [],
          w = "",
          bits = 0,
          maxpower = 2,
          power = 0,
          c = "",
          data_val = getNextValue(0),
          data_position = resetValue,
          data_index = 1;

        // Get first token, guaranteed to be either
        // a new character token (8 or 16 bits)
        // or end of stream token.
        while (power != maxpower) {
          bits += ((data_val >> --data_position) & 1) << power++;
          if (data_position == 0) {
            data_position = resetValue;
            data_val = getNextValue(data_index++);
          }
        }

        // if end of stream token, return empty string
        if (bits == 2) {
          return "";
        }

        // else, get character
        maxpower = bits * 8 + 8;
        bits = power = 0;
        while (power != maxpower) {
          bits += ((data_val >> --data_position) & 1) << power++;
          if (data_position == 0) {
            data_position = resetValue;
            data_val = getNextValue(data_index++);
          }
        }
        c = f(bits);
        dictionary[3] = c;
        w = c;
        result.push(c);

        // read rest of string
        while (data_index <= length) {
          // read out next token
          maxpower = numBits;
          bits = power = 0;
          while (power != maxpower) {
            bits += ((data_val >> --data_position) & 1) << power++;
            if (data_position == 0) {
              data_position = resetValue;
              data_val = getNextValue(data_index++);
            }
          }

          // 0 or 1 implies new character token
          if (bits < 2) {
            maxpower = (8 + 8 * bits);
            bits = power = 0;
            while (power != maxpower) {
              bits += ((data_val >> --data_position) & 1) << power++;
              if (data_position == 0) {
                data_position = resetValue;
                data_val = getNextValue(data_index++);
              }
            }
            dictionary[dictSize] = f(bits);
            bits = dictSize++;
            if (--enlargeIn == 0) {
              enlargeIn = 1 << numBits++;
            }
          } else if (bits == 2) {
            // end of stream token
            return result.join('');
          }

          if (bits > dictionary.length) {
            return null;
          }
          entry = bits < dictionary.length ? dictionary[bits] : w + w.charAt(0);
          result.push(entry);
          // Add w+entry[0] to the dictionary.
          dictionary[dictSize++] = w + entry.charAt(0);

          w = entry;

          if (--enlargeIn == 0) {
            enlargeIn = 1 << numBits++;
          }

        }
        return "";
      }
    };
    return LZString;
  }
)();

if (typeof define === 'function' && define.amd) {
  define(function () { return LZString; });
} else if (typeof module !== 'undefined' && module != null) {
  module.exports = LZString
} else if (typeof angular !== 'undefined' && angular != null) {
  angular.module('LZString', [])
    .factory('LZString', function () {
      return LZString;
    });
}
