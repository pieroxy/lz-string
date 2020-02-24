// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// This lib is part of the lz-string project.
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/index.html
//
// Base64 compression / decompression for already compressed content (gif, png, jpg, mp3, ...)
// version 1.4.1

var Base64String = (function(){
var f = String.fromCharCode;
var keyEnc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split('');
var keyDec = (function (){
    var dict = {},
        i = keyEnc.length;
    while(i--){
      dict[keyEnc[i]] = i;
    }
    return dict;
  })();

var Base64String = {

  compressToUTF16 : function (input) {
    var output = [],
        i,c,
        current,
        status = 0;

    input = this.compressToArray(input);

    for (i=0 ; i<input.length ; i++) {
      c = input[i].charCodeAt();
      switch (status++) {
        case 0:
          output.push(f((c >> 1)+32));
          current = (c & 1) << 14;
          break;
        case 1:
          output.push(f((current + (c >> 2))+32));
          current = (c & 3) << 13;
          break;
        case 2:
          output.push(f((current + (c >> 3))+32));
          current = (c & 7) << 12;
          break;
        case 3:
          output.push(f((current + (c >> 4))+32));
          current = (c & 15) << 11;
          break;
        case 4:
          output.push(f((current + (c >> 5))+32));
          current = (c & 31) << 10;
          break;
        case 5:
          output.push(f((current + (c >> 6))+32));
          current = (c & 63) << 9;
          break;
        case 6:
          output.push(f((current + (c >> 7))+32));
          current = (c & 127) << 8;
          break;
        case 7:
          output.push(f((current + (c >> 8))+32));
          current = (c & 255) << 7;
          break;
        case 8:
          output.push(f((current + (c >> 9))+32));
          current = (c & 511) << 6;
          break;
        case 9:
          output.push(f((current + (c >> 10))+32));
          current = (c & 1023) << 5;
          break;
        case 10:
          output.push(f((current + (c >> 11))+32));
          current = (c & 2047) << 4;
          break;
        case 11:
          output.push(f((current + (c >> 12))+32));
          current = (c & 4095) << 3;
          break;
        case 12:
          output.push(f((current + (c >> 13))+32));
          current = (c & 8191) << 2;
          break;
        case 13:
          output.push(f((current + (c >> 14))+32));
          current = (c & 16383) << 1;
          break;
        case 14:
          output.push(f((current + (c >> 15))+32, (c & 32767)+32));
          status = 0;
          break;
      }
    }
    output.push(f(current + 32));
    return output.join('');
  },


  decompressFromUTF16 : function (input) {
    var output = [],
        current,c,
        status=0,
        i = 0;

    while (i < input.length) {
      c = input.charCodeAt(i) - 32;

      switch (status++) {
        case 0:
          current = c << 1;
          break;
        case 1:
          output.push(f(current | (c >> 14)));
          current = (c&16383) << 2;
          break;
        case 2:
          output.push(f(current | (c >> 13)));
          current = (c&8191) << 3;
          break;
        case 3:
          output.push(f(current | (c >> 12)));
          current = (c&4095) << 4;
          break;
        case 4:
          output.push(f(current | (c >> 11)));
          current = (c&2047) << 5;
          break;
        case 5:
          output.push(f(current | (c >> 10)));
          current = (c&1023) << 6;
          break;
        case 6:
          output.push(f(current | (c >> 9)));
          current = (c&511) << 7;
          break;
        case 7:
          output.push(f(current | (c >> 8)));
          current = (c&255) << 8;
          break;
        case 8:
          output.push(f(current | (c >> 7)));
          current = (c&127) << 9;
          break;
        case 9:
          output.push(f(current | (c >> 6)));
          current = (c&63) << 10;
          break;
        case 10:
          output.push(f(current | (c >> 5)));
          current = (c&31) << 11;
          break;
        case 11:
          output.push(f(current | (c >> 4)));
          current = (c&15) << 12;
          break;
        case 12:
          output.push(f(current | (c >> 3)));
          current = (c&7) << 13;
          break;
        case 13:
          output.push(f(current | (c >> 2)));
          current = (c&3) << 14;
          break;
        case 14:
          output.push(f(current | (c >> 1)));
          current = (c&1) << 15;
          break;
        case 15:
          output.push(f(current | c));
          status=0;
          break;
      }


      i++;
    }

    return this.decompressFromArray(output);

  },

  decompress : function (input) {
    var output = [],
        chrc, chr1, chr2, chr3,
        i = 1,
        odd = input.charCodeAt(0) >> 8;

    while (i < input.length*2 && (i < input.length*2-1 || odd==0)) {

      if (i%2==0) {
        chrc = input.charCodeAt(i/2);
        chr1 = chrc >> 8;
        chr2 = chrc & 255;
        if (i/2+1 < input.length)
          chr3 = input.charCodeAt(i/2+1) >> 8;
        else
          chr3 = NaN;
      } else {
        chr1 = input.charCodeAt((i-1)/2) & 255;
        if ((i+1)/2 < input.length) {
          chrc = input.charCodeAt((i+1)/2);
          chr2 = chrc >> 8;
          chr3 = chrc & 255;
        } else
          chr2=chr3=NaN;
      }
      i+=3;

      this._chrToOutput(i, input.length, chr1, chr2, chr3, output);
    }

    return output.join('');
  },

  decompressFromArray : function (input) {
    var output = [],
        chrc, chr1, chr2, chr3,
        i = 1,
        odd = input[0].charCodeAt() >> 8;

    while (i < input.length*2 && (i < input.length*2-1 || odd==0)) {

      if (i%2==0) {
        chrc = input[i/2].charCodeAt();
        chr1 = chrc >> 8;
        chr2 = chrc & 255;
        if (i/2+1 < input.length)
          chr3 = input[i/2+1].charCodeAt() >> 8;
        else
          chr3 = NaN;
      } else {
        chr1 = input[(i-1)/2].charCodeAt() & 255;
        if ((i+1)/2 < input.length) {
          chrc = input[(i+1)/2].charCodeAt()
          chr2 = chrc >> 8;
          chr3 = chrc & 255;
        } else
          chr2=chr3=NaN;
      }
      i+=3;

      this._chrToOutput(i, input.length, chr1, chr2, chr3, output);
    }

    return output.join('');
  },

  // private function to reduce code duplication between
  // decompress and decompressFromArray
  _chrToOutput : function (i, length, chr1, chr2, chr3, output) {
      var enc1 = chr1 >> 2,
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4),
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6),
          enc4 = chr3 & 63;
      if (isNaN(chr2) || (i==length*2+1 && odd)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3) || (i==length*2 && odd)) {
        enc4 = 64;
      }
      output.push(keyDec[enc1]);
      output.push(keyDec[enc2]);
      output.push(keyDec[enc3]);
      output.push(keyDec[enc4]);
  },

  compress : function (input) {
    return this.compressToArray(input).join('');
  },

  compressToArray : function (input) {
    var output = [],
        ol = 1,
        output_,
        chr1, chr2, chr3,
        enc1, enc2, enc3, enc4,
        i = 0, flush=false;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

      enc1 = keyEnc[input.charAt(i++)];
      enc2 = keyEnc[input.charAt(i++)];
      enc3 = keyEnc[input.charAt(i++)];
      enc4 = keyEnc[input.charAt(i++)];

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      if (ol%2==0) {
        output_ = chr1 << 8;
        flush = true;

        if (enc3 != 64) {
          output.push(f(output_ | chr2));
          flush = false;
        }
        if (enc4 != 64) {
          output_ = chr3 << 8;
          flush = true;
        }
      } else {
        output.push(f(output_ | chr1));
        flush = false;

        if (enc3 != 64) {
          output_ = chr2 << 8;
          flush = true;
        }
        if (enc4 != 64) {
          output.push(f(output_ | chr3));
          flush = false;
        }
      }
      ol+=3;
    }

    if (flush) {
      output.push(f(output_));
      output[0] = f(output[0].charCodeAt()|256);
    }
    return output;
  },

}
return Base64String;
})()
