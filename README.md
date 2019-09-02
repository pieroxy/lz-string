lz-string
=========
LZ-based compression algorithm for JavaScript

## Warning (migrating from version 1.3.4 - nov 2014)
Files have changed locations and name since a recent release. The new release file is in `libs/lz-string.min.js` (or in `libs/lz-string.js` if you don't care for the minified version)

Sorry about the mess in other repos. This will not happen again.

## Note on server side

If you are using one of the ports of lz-string to decode on the server what was encoded in the browser, you might want to use version 1.3.7 as the version 1.3.8 introduced a slight change in the encoding. While the JS versions are completely cross-compatible, the PHP, Go, ... versions might not be as forgiving.

## Install via [npm](https://npmjs.org/)

```shell
$ npm install -g lz-string
$ lz-string input.js > output.txt
```

## Home page
Home page for this program with examples, documentation and a live demo: http://pieroxy.net/blog/pages/lz-string/index.html

## Other languages
This lib has numerous ports to other languages, for server side processing, mostly. Here they are:


* Java: [Diogo Duailibe did an implementation in Java](https://github.com/diogoduailibe/lzstring4j)
* Java: [Another implementation in Java, with base64 support and better performances by rufushuang](https://github.com/rufushuang/lz-string4java)
* C#: [Jawa-the-Hutt did an implementation in C#](https://github.com/jawa-the-hutt/lz-string-csharp)
* C#: [kreudom did another implementation in C#, more up to date](https://github.com/kreudom/lz-string-csharp)
* PHP: [nullpunkt released a php version](https://github.com/nullpunkt/lz-string-php)
* Python3: [eduardtomasek did an implementation in python 3](https://github.com/eduardtomasek/lz-string-python)
* Go [I helped a friend to write a Go implementation of the decompression algorithm](https://github.com/pieroxy/lz-string-go)
* Go [Austin wrote the decompression part as well](https://github.com/austinh115/lz-string-go)
* Elixir [Here is an Elixir version, by Michael Shapiro](https://github.com/koudelka/elixir-lz-string)
* C++/QT [Here is a C++/Qt version, by AmiArt](https://github.com/AmiArt/qt-lzstring)
* VB.NET [Here is a VB.NET version, by gsemac](https://github.com/gsemac/lz-string-vb)
* Salesforce Apex( Java like language): [bilal did the port](https://github.com/bilalfastian/LZ4String)
* Kotlin: [from Zen Liu](https://github.com/ZenLiuCN/lz-string4k)
* Dart: [from skipness](https://github.com/ZenLiuCN/lz-string4k)
* Haxe: [from markknol](https://haxe.org https://github.com/markknol/hx-lzstring)
