 var transportSafe = (function () {
 	var map = {
 		'A': 'a',
 		'B': 'b',
 		'C': 'c',
 		'D': 'd',
 		'E': 'e',
 		'F': 'f',
 		'G': 'g',
 		'H': 'h',
 		'I': 'i',
 		'J': 'j',
 		'K': 'k',
 		'L': 'l',
 		'M': 'm',
 		'N': 'n',
 		'O': 'o',
 		'P': 'p',
 		'Q': 'q',
 		'R': 'r',
 		'S': 's',
 		'T': 't',
 		'U': 'u',
 		'V': 'v',
 		'W': 'w',
 		'X': 'x',
 		'Y': 'y',
 		'Z': 'z',
 		'0': '[',
 		'1': ']',
 		'2': '{',
 		'3': '}',
 		'4': '<',
 		'5': '>',
 		'6': '(',
 		'7': ')',
 		'8': '|',
 		'9': '='
 	};

 	// Add reverse references for decode()
 	for (var key in map) {
 		if (map.hasOwnProperty(key)) {
 			map['%u' + key] = map[key];
 			map[map[key]] = '%u' + key;
 		}
 	}

 	return {
 		// Pass a String to escape and encode
 		'encode': function (str) {
 			return escape(str)
 				.replace(/([^\%])([a-z])/g, '$1$2!') //Escape any lowercase (high unicode) characters first
 			.replace(/\%u./g, function (s) { //Substitute all %u for the shorthand version from map{}
 				return map[s];
 			});
 		},
 		// Pass a String to decode and unescape
 		'decode': function (str) {

 			// First reset %u characters, then normalize remaining lower case
 			return unescape(str.replace(/([a-z\[\]\{\}\<\>\(\)\|\=])([^\!])/g, function (a, s1, s2) {
 				return map[s1] + s2;
 			}).replace(/([a-z])\!/g, '$1'));
 		}
 	};

 }());