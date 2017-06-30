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
var f = String.fromCharCode;
var Base64CharArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split('');
var UriSafeCharArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$".split('');
var baseReverseDic = {};

function getReverseDict(alphabet){
  if (!baseReverseDic[alphabet]) {
    baseReverseDic[alphabet] = {};
    for (var i=0 ; i<alphabet.length ; i++) {
      baseReverseDic[alphabet][alphabet[i].charCodeAt(0)] = i;
    }
  }
  return baseReverseDic[alphabet];
}

var LZString = {
  compressToBase64 : function (input) {
    if (input == null) return "";
    var res = LZString._compressToArray(input, 6, function(a){return Base64CharArray[a];});
    // To produce valid Base64
    var i = res.length % 4;
    while(i--){
      res.push("=");
    }

    return res.join('');
  },

  decompressFromBase64 : function (input) {
    if (input == null) return "";
    if (input == "") return null;
    var reverseDict = getReverseDict(Base64CharArray);
    return LZString._decompress(input.length, 32, function(index) { return reverseDict[input.charCodeAt(index)]; });
  },

  compressToUTF16 : function (input) {
    if (input == null) return "";
    var compressed = LZString._compressToArray(input, 15, function(a){return f(a+32);});
    compressed.push(" ");
    return compressed.join('');
  },

  decompressFromUTF16: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });
  },

  //compress into uint8array (UCS-2 big endian format)
  compressToUint8Array: function (uncompressed) {
    var compressed = LZString.compressToArray(uncompressed);
    var buf=new Uint8Array(compressed.length*2); // 2 bytes per character

    for (var i=0, TotalLen=compressed.length; i<TotalLen; i++) {
      var current_value = compressed[i].charCodeAt(0);
      buf[i*2] = current_value >>> 8;
      buf[i*2+1] = current_value & 0xFF;
    }
    return buf;
  },

  //decompress from uint8array (UCS-2 big endian format)
  decompressFromUint8Array:function (compressed) {
    if (compressed===null || compressed===undefined){
        return LZString.decompressFromArray(compressed);
    } else if (compressed.length == 0){
      return null;
    }
    return LZString._decompress(compressed.length, 128, function (index) { return compressed[index]; });
  },


  //compress into a string that is already URI encoded
  compressToEncodedURIComponent: function (input) {
    if (input == null) return "";
    return LZString._compressToArray(input, 6, function(a){return UriSafeCharArray[a];}).join('');
  },

  //decompress from an output of compressToEncodedURIComponent
  decompressFromEncodedURIComponent:function (input) {
    if (input == null) return "";
    if (input == "") return null;
    input = input.replace(/ /g, "+");
    var reverseDict = getReverseDict(UriSafeCharArray);
    return LZString._decompress(input.length, 32, function(index) { return reverseDict[input.charCodeAt(index)]; });
  },

  compress: function (uncompressed) {
    return LZString.compressToArray(uncompressed).join('');
  },
  compressToArray: function (uncompressed){
    return LZString._compressToArray(uncompressed, 16, function(a){return f(a);});
  },
  _compressToArray: function (uncompressed, bitsPerChar, getCharFromInt){
    if (uncompressed == null) return [];
    var i=0, j=0, value=0,
        dictionary={},
        dictionaryToCreate={},
        c=0,
        node=dictionary,
        node_c=0,
        new_node={},
        enlargeIn= 2, // Compensate for the first entry which should not count
        dictSize= 3,
        numBits= 2,
        data=[],
        data_val=0,
        data_position=0;

    for (j = 0; j < uncompressed.length; j++) {
      c = uncompressed.charCodeAt(j);

      // Is c a new character that needs to
      // be stored at the root?
      if (dictionary[c] == undefined) {
        new_node = {};
        new_node[-1] = dictSize++;
        new_node[-2] = c;
        dictionary[c] = new_node;
        dictionaryToCreate[c] = true;
      }

      new_node = node[c];
      if (new_node) {
        node = new_node;
      } else {
        node_c = node[-2];
        if (dictionaryToCreate[node_c]) {
          if (node_c<256) {
            for (i=0 ; i<numBits ; i++) {
              data_val = (data_val << 1);
              if (data_position == bitsPerChar-1) {
                data_position = 0;
                data.push(getCharFromInt(data_val));
                data_val = 0;
              } else {
                data_position++;
              }
            }
            value = node_c;
            for (i=0 ; i<8 ; i++) {
              data_val = (data_val << 1) | (value&1);
              if (data_position == bitsPerChar-1) {
                data_position = 0;
                data.push(getCharFromInt(data_val));
                data_val = 0;
              } else {
                data_position++;
              }
              value >>= 1;
            }
          } else {
            value = 1;
            for (i=0 ; i<numBits ; i++) {
              data_val = (data_val << 1) | value;
              if (data_position ==bitsPerChar-1) {
                data_position = 0;
                data.push(getCharFromInt(data_val));
                data_val = 0;
              } else {
                data_position++;
              }
              value = 0;
            }
            value = node_c;
            for (i=0 ; i<16 ; i++) {
              data_val = (data_val << 1) | (value&1);
              if (data_position == bitsPerChar-1) {
                data_position = 0;
                data.push(getCharFromInt(data_val));
                data_val = 0;
              } else {
                data_position++;
              }
              value >>= 1;
            }
          }
          enlargeIn--;
          if (enlargeIn == 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
          }
          dictionaryToCreate[node_c] = false;
        } else {
          value = node[-1];
          for (i=0 ; i<numBits ; i++) {
            data_val = (data_val << 1) | (value&1);
            if (data_position == bitsPerChar-1) {
              data_position = 0;
              data.push(getCharFromInt(data_val));
              data_val = 0;
            } else {
              data_position++;
            }
            value >>= 1;
          }
        }
        enlargeIn--;
        if (enlargeIn == 0) {
          enlargeIn = Math.pow(2, numBits);
          numBits++;
        }
        // Add prefix to the dictionary.
        new_node = {};
        new_node[-1] = dictSize++;
        new_node[-2] = c;
        node[c] = new_node;
        node = dictionary[c];
      }
    }

    // Output the code for node.
    if (node !== undefined) {
      node_c = node[-2];
      if (dictionaryToCreate[node_c]) {
        if (node_c<256) {
          for (i=0 ; i<numBits ; i++) {
            data_val = (data_val << 1);
            if (data_position == bitsPerChar-1) {
              data_position = 0;
              data.push(getCharFromInt(data_val));
              data_val = 0;
            } else {
              data_position++;
            }
          }
          value = node_c;
          for (i=0 ; i<8 ; i++) {
            data_val = (data_val << 1) | (value&1);
            if (data_position == bitsPerChar-1) {
              data_position = 0;
              data.push(getCharFromInt(data_val));
              data_val = 0;
            } else {
              data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i=0 ; i<numBits ; i++) {
            data_val = (data_val << 1) | value;
            if (data_position == bitsPerChar-1) {
              data_position = 0;
              data.push(getCharFromInt(data_val));
              data_val = 0;
            } else {
              data_position++;
            }
            value = 0;
          }
          value = node_c;
          for (i=0 ; i<16 ; i++) {
            data_val = (data_val << 1) | (value&1);
            if (data_position == bitsPerChar-1) {
              data_position = 0;
              data.push(getCharFromInt(data_val));
              data_val = 0;
            } else {
              data_position++;
            }
            value = value >> 1;
          }
        }
        enlargeIn--;
        if (enlargeIn == 0) {
          enlargeIn = Math.pow(2, numBits);
          numBits++;
        }
        dictionaryToCreate[node_c] = false;
      } else {
        value = node[-1];
        for (i=0 ; i<numBits ; i++) {
          data_val = (data_val << 1) | (value&1);
          if (data_position == bitsPerChar-1) {
            data_position = 0;
            data.push(getCharFromInt(data_val));
            data_val = 0;
          } else {
            data_position++;
          }
          value >>= 1;
        }


      }
      enlargeIn--;
      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }
    }

    // Mark the end of the stream
    value = 2;
    for (i=0 ; i<numBits ; i++) {
      data_val = (data_val << 1) | (value&1);
      if (data_position == bitsPerChar-1) {
        data_position = 0;
        data.push(getCharFromInt(data_val));
        data_val = 0;
      } else {
        data_position++;
      }
      value >>= 1;
    }

    // Flush the last char
    while (true) {
      data_val = (data_val << 1);
      if (data_position == bitsPerChar-1) {
        data.push(getCharFromInt(data_val));
        break;
      }
      else data_position++;
    }
    return data;
  },

  decompress: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
  },

  decompressFromArray: function (compressed) {
    if (compressed == null) return "";
    if (compressed.length == 0) return null;
    return LZString._decompress(compressed.length, 32768, function(index) { return compressed[index].charCodeAt(0); });  },

  _decompress: function (length, resetValue, getNextValue) {
    var dictionary = [],
        next,
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
        i,
        w,
        bits, resb, maxpower, power,
        c,
        data = {val:getNextValue(0), position:resetValue, index:1};

    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }

    bits = 0;
    maxpower = Math.pow(2,2);
    power=1;
    while (power!=maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb>0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch (next = bits) {
      case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 2:
        return "";
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
      if (data.index > length) {
        return "";
      }

      bits = 0;
      maxpower = Math.pow(2,numBits);
      power=1;
      while (power!=maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch (c = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 2:
          return result.join('');
      }

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      result.push(entry);

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;

      w = entry;

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

    }
  }
};
  return LZString;
})();

if (typeof define === 'function' && define.amd) {
  define(function () { return LZString; });
} else if( typeof module !== 'undefined' && module != null ) {
  module.exports = LZString
} else if( typeof angular !== 'undefined' && angular != null ) {
  angular.module('LZString', [])
  .factory('LZString', function () {
    return LZString;
  });
}
