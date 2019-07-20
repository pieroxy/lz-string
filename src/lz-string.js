// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// For licensing information see LICENSE
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm for JavaScript, version 1.5.0
/* eslint-disable no-underscore-dangle,no-bitwise,default-case */

const f = String.fromCharCode;
const keyStrBase64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const keyStrUriSafe = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$';
const baseReverseDic = {};

const _getBaseValue = (alphabet, character) => {
	if (!baseReverseDic[alphabet]) {
		baseReverseDic[alphabet] = {};
		for (let i = 0; i < alphabet.length; i += 1) {
			baseReverseDic[alphabet][alphabet.charAt(i)] = i;
		}
	}
	return baseReverseDic[alphabet][character];
};

const _compress = (uncompressed, bitsPerChar, getCharFromInt) => {
	if (uncompressed === null || uncompressed === void 0) return '';
	let i; let value;
	const contextDictionary = {};
	const contextDictionaryToCreate = {};
	let contextC = '';
	let contextWC = '';
	let contextW = '';
	let contextEnlargeIn = 2; // Compensate for the first entry which should not count
	let contextDictSize = 3;
	let contextNumBits = 2;
	const contextData = [];
	let contextDataVal = 0;
	let contextDataPosition = 0;
	let ii;

	for (ii = 0; ii < uncompressed.length; ii += 1) {
		contextC = uncompressed.charAt(ii);
		if (!Object.prototype.hasOwnProperty.call(contextDictionary, contextC)) {
			contextDictionary[contextC] = contextDictSize;
			contextDictSize += 1;
			contextDictionaryToCreate[contextC] = true;
		}

		contextWC = contextW + contextC;
		if (Object.prototype.hasOwnProperty.call(contextDictionary, contextWC)) {
			contextW = contextWC;
		} else {
			if (Object.prototype.hasOwnProperty.call(contextDictionaryToCreate, contextW)) {
				if (contextW.charCodeAt(0) < 256) {
					for (i = 0; i < contextNumBits; i += 1) {
						contextDataVal <<= 1;
						if (contextDataPosition === bitsPerChar - 1) {
							contextDataPosition = 0;
							contextData.push(getCharFromInt(contextDataVal));
							contextDataVal = 0;
						} else {
							contextDataPosition += 1;
						}
					}
					value = contextW.charCodeAt(0);
					for (i = 0; i < 8; i += 1) {
						contextDataVal = (contextDataVal << 1) | (value & 1);
						if (contextDataPosition === bitsPerChar - 1) {
							contextDataPosition = 0;
							contextData.push(getCharFromInt(contextDataVal));
							contextDataVal = 0;
						} else {
							contextDataPosition += 1;
						}
						value >>= 1;
					}
				} else {
					value = 1;
					for (i = 0; i < contextNumBits; i += 1) {
						contextDataVal = (contextDataVal << 1) | value;
						if (contextDataPosition === bitsPerChar - 1) {
							contextDataPosition = 0;
							contextData.push(getCharFromInt(contextDataVal));
							contextDataVal = 0;
						} else {
							contextDataPosition += 1;
						}
						value = 0;
					}
					value = contextW.charCodeAt(0);
					for (i = 0; i < 16; i += 1) {
						contextDataVal = (contextDataVal << 1) | (value & 1);
						if (contextDataPosition === bitsPerChar - 1) {
							contextDataPosition = 0;
							contextData.push(getCharFromInt(contextDataVal));
							contextDataVal = 0;
						} else {
							contextDataPosition += 1;
						}
						value >>= 1;
					}
				}
				contextEnlargeIn -= 1;
				if (contextEnlargeIn === 0) {
					contextEnlargeIn = 2 ** contextNumBits;
					contextNumBits += 1;
				}
				delete contextDictionaryToCreate[contextW];
			} else {
				value = contextDictionary[contextW];
				for (i = 0; i < contextNumBits; i += 1) {
					contextDataVal = (contextDataVal << 1) | (value & 1);
					if (contextDataPosition === bitsPerChar - 1) {
						contextDataPosition = 0;
						contextData.push(getCharFromInt(contextDataVal));
						contextDataVal = 0;
					} else {
						contextDataPosition += 1;
					}
					value >>= 1;
				}
			}
			contextEnlargeIn -= 1;
			if (contextEnlargeIn === 0) {
				contextEnlargeIn = 2 ** contextNumBits;
				contextNumBits += 1;
			}
			// Add wc to the dictionary.
			contextDictionary[contextWC] = contextDictSize;
			contextDictSize += 1;
			contextW = String(contextC);
		}
	}

	// Output the code for w.
	if (contextW !== '') {
		if (Object.prototype.hasOwnProperty.call(contextDictionaryToCreate, contextW)) {
			if (contextW.charCodeAt(0) < 256) {
				for (i = 0; i < contextNumBits; i += 1) {
					contextDataVal <<= 1;
					if (contextDataPosition === bitsPerChar - 1) {
						contextDataPosition = 0;
						contextData.push(getCharFromInt(contextDataVal));
						contextDataVal = 0;
					} else {
						contextDataPosition += 1;
					}
				}
				value = contextW.charCodeAt(0);
				for (i = 0; i < 8; i += 1) {
					contextDataVal = (contextDataVal << 1) | (value & 1);
					if (contextDataPosition === bitsPerChar - 1) {
						contextDataPosition = 0;
						contextData.push(getCharFromInt(contextDataVal));
						contextDataVal = 0;
					} else {
						contextDataPosition += 1;
					}
					value >>= 1;
				}
			} else {
				value = 1;
				for (i = 0; i < contextNumBits; i += 1) {
					contextDataVal = (contextDataVal << 1) | value;
					if (contextDataPosition === bitsPerChar - 1) {
						contextDataPosition = 0;
						contextData.push(getCharFromInt(contextDataVal));
						contextDataVal = 0;
					} else {
						contextDataPosition += 1;
					}
					value = 0;
				}
				value = contextW.charCodeAt(0);
				for (i = 0; i < 16; i += 1) {
					contextDataVal = (contextDataVal << 1) | (value & 1);
					if (contextDataPosition === bitsPerChar - 1) {
						contextDataPosition = 0;
						contextData.push(getCharFromInt(contextDataVal));
						contextDataVal = 0;
					} else {
						contextDataPosition += 1;
					}
					value >>= 1;
				}
			}
			contextEnlargeIn -= 1;
			if (contextEnlargeIn === 0) {
				contextEnlargeIn = 2 ** contextNumBits;
				contextNumBits += 1;
			}
			delete contextDictionaryToCreate[contextW];
		} else {
			value = contextDictionary[contextW];
			for (i = 0; i < contextNumBits; i += 1) {
				contextDataVal = (contextDataVal << 1) | (value & 1);
				if (contextDataPosition === bitsPerChar - 1) {
					contextDataPosition = 0;
					contextData.push(getCharFromInt(contextDataVal));
					contextDataVal = 0;
				} else {
					contextDataPosition += 1;
				}
				value >>= 1;
			}
		}
		contextEnlargeIn -= 1;
		if (contextEnlargeIn === 0) {
			contextEnlargeIn = 2 ** contextNumBits;
			contextNumBits += 1;
		}
	}

	// Mark the end of the stream
	value = 2;
	for (i = 0; i < contextNumBits; i += 1) {
		contextDataVal = (contextDataVal << 1) | (value & 1);
		if (contextDataPosition === bitsPerChar - 1) {
			contextDataPosition = 0;
			contextData.push(getCharFromInt(contextDataVal));
			contextDataVal = 0;
		} else {
			contextDataPosition += 1;
		}
		value >>= 1;
	}

	// Flush the last char
	let iterate = true;
	while (iterate) {
		contextDataVal <<= 1;
		if (contextDataPosition === bitsPerChar - 1) {
			contextData.push(getCharFromInt(contextDataVal));
			iterate = false;
			break;
		} else {
			contextDataPosition += 1;
		}
	}
	return contextData.join('');
};

const _decompress = (length, resetValue, getNextValue) => {
	const dictionary = [];
	let enlargeIn = 4;
	let dictSize = 4;
	let numBits = 3;
	let entry = '';
	const result = [];
	let i;
	let w;
	let bits; let resb; let maxpower; let power;
	let c;
	const data = { val: getNextValue(0), position: resetValue, index: 1 };

	for (i = 0; i < 3; i += 1) {
		dictionary[i] = i;
	}

	bits = 0;
	maxpower = 2 ** 2;
	power = 1;
	while (power !== maxpower) {
		resb = data.val & data.position;
		data.position >>= 1;
		if (data.position === 0) {
			data.position = resetValue;
			data.val = getNextValue(data.index);
			data.index += 1;
		}
		bits |= (resb > 0 ? 1 : 0) * power;
		power <<= 1;
	}

	switch (bits) {
		case 0:
			bits = 0;
			maxpower = 2 ** 8;
			power = 1;
			while (power !== maxpower) {
				resb = data.val & data.position;
				data.position >>= 1;
				if (data.position === 0) {
					data.position = resetValue;
					data.val = getNextValue(data.index);
					data.index += 1;
				}
				bits |= (resb > 0 ? 1 : 0) * power;
				power <<= 1;
			}
			c = f(bits);
			break;
		case 1:
			bits = 0;
			maxpower = 2 ** 16;
			power = 1;
			while (power !== maxpower) {
				resb = data.val & data.position;
				data.position >>= 1;
				if (data.position === 0) {
					data.position = resetValue;
					data.val = getNextValue(data.index);
					data.index += 1;
				}
				bits |= (resb > 0 ? 1 : 0) * power;
				power <<= 1;
			}
			c = f(bits);
			break;
		case 2:
			return '';
	}
	dictionary[3] = c;
	w = c;
	result.push(c);
	let iterate = true;
	while (iterate) {
		if (data.index > length) {
			iterate = false;
			return '';
		}

		bits = 0;
		maxpower = 2 ** numBits;
		power = 1;
		while (power !== maxpower) {
			resb = data.val & data.position;
			data.position >>= 1;
			if (data.position === 0) {
				data.position = resetValue;
				data.val = getNextValue(data.index);
				data.index += 1;
			}
			bits |= (resb > 0 ? 1 : 0) * power;
			power <<= 1;
		}

		switch (c = bits) {
			case 0:
				bits = 0;
				maxpower = 2 ** 8;
				power = 1;
				while (power !== maxpower) {
					resb = data.val & data.position;
					data.position >>= 1;
					if (data.position === 0) {
						data.position = resetValue;
						data.val = getNextValue(data.index);
						data.index += 1;
					}
					bits |= (resb > 0 ? 1 : 0) * power;
					power <<= 1;
				}

				dictionary[dictSize] = f(bits);
				dictSize += 1;
				c = dictSize - 1;
				enlargeIn -= 1;
				break;
			case 1:
				bits = 0;
				maxpower = 2 ** 16;
				power = 1;
				while (power !== maxpower) {
					resb = data.val & data.position;
					data.position >>= 1;
					if (data.position === 0) {
						data.position = resetValue;
						data.val = getNextValue(data.index);
						data.index += 1;
					}
					bits |= (resb > 0 ? 1 : 0) * power;
					power <<= 1;
				}
				dictionary[dictSize] = f(bits);
				dictSize += 1;
				c = dictSize - 1;
				enlargeIn -= 1;
				break;
			case 2:
				iterate = false;
				return result.join('');
		}

		if (enlargeIn === 0) {
			enlargeIn = 2 ** numBits;
			numBits += 1;
		}

		if (dictionary[c]) {
			entry = dictionary[c];
		} else if (c === dictSize) {
			entry = w + w.charAt(0);
		} else {
			iterate = false;
			return null;
		}
		result.push(entry);

		// Add w+entry[0] to the dictionary.
		dictionary[dictSize] = w + entry.charAt(0);
		dictSize += 1;
		enlargeIn -= 1;

		w = entry;

		if (enlargeIn === 0) {
			enlargeIn = 2 ** numBits;
			numBits += 1;
		}
	}
	return void 0;
};

export const compress = uncompressed => _compress(uncompressed, 16, a => f(a));

export const decompress = (compressed) => {
	if (compressed === null) return '';
	if (compressed === '') return null;
	return _decompress(compressed.length, 32768, index => compressed.charCodeAt(index));
};

export const compressToBase64 = (input) => {
	if (input === null) return '';
	const res = _compress(input, 6, a => keyStrBase64.charAt(a));
	switch (res.length % 4) { // To produce valid Base64
		default: // When could this happen ?
		case 0: return res;
		case 1: return `${res}===`;
		case 2: return `${res}==`;
		case 3: return `${res}=`;
	}
};

export const decompressFromBase64 = (input) => {
	if (input === null) return '';
	if (input === '') return null;
	return _decompress(input.length, 32, index => _getBaseValue(keyStrBase64, input.charAt(index)));
};

export const compressToUTF16 = (input) => {
	if (input === null || input === void 0) return '';
	return `${_compress(input, 15, a => f(a + 32))} `;
};

export const decompressFromUTF16 = (compressed) => {
	if (compressed === null) return '';
	if (compressed === '') return null;
	return _decompress(compressed.length, 16384, index => compressed.charCodeAt(index) - 32);
};

// compress into uint8array (UCS-2 big endian format)
export const compressToUint8Array = (uncompressed) => {
	const compressed = compress(uncompressed);
	const buf = new Uint8Array(compressed.length * 2); // 2 bytes per character

	for (let i = 0, TotalLen = compressed.length; i < TotalLen; i += 1) {
		const currentValue = compressed.charCodeAt(i);
		buf[i * 2] = currentValue >>> 8;
		buf[i * 2 + 1] = currentValue % 256;
	}
	return buf;
};

// decompress from uint8array (UCS-2 big endian format)
export const decompressFromUint8Array = (compressed) => {
	if (compressed === null || compressed === undefined) {
		return decompress(compressed);
	}
	const buf = new Array(compressed.length / 2); // 2 bytes per character
	for (let i = 0, TotalLen = buf.length; i < TotalLen; i += 1) {
		buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
	}

	const result = [];
	buf.forEach((c) => {
		result.push(f(c));
	});
	return decompress(result.join(''));
};

// compress into a string that is already URI encoded
export const compressToEncodedURIComponent = (input) => {
	if (input === null) return '';
	return _compress(input, 6, a => keyStrUriSafe.charAt(a));
};

// decompress from an output of compressToEncodedURIComponent
export const decompressFromEncodedURIComponent = (input) => {
	if (input === null) return '';
	if (input === '') return null;
	const newInput = input.replace(/ /g, '+');
	return _decompress(
		newInput.length,
		32,
		index => _getBaseValue(keyStrUriSafe, newInput.charAt(index)),
	);
};
