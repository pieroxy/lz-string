# lz-string

[![Node.js CI](https://github.com/pieroxy/lz-string/actions/workflows/ci.yml/badge.svg)](https://github.com/pieroxy/lz-string/actions/workflows/ci.yml) ![Version](https://img.shields.io/github/package-json/v/pieroxy/lz-string/master.svg?logo=github) [![npm package](https://img.shields.io/npm/v/lz-string.svg?logo=npm)](https://www.npmjs.com/package/lz-string?logo=npm) ![Downloads](https://img.shields.io/npm/dw/lz-string.svg?logo=npm) [![Documentation](https://img.shields.io/badge/Documentation-blue?logo=readthedocs&logoColor=midnightblue)](http://pieroxy.net/blog/pages/lz-string/index.html)

LZ-based compression algorithm for JavaScript

> [!IMPORTANT]
> The file layout has changed in version 2, this is now a joint `commonjs` / `esmodule` project so modern build tools should be happy with it, but if importing a file directly (such as in a direct javascript project) it is important to use the correct one.

> [!TIP]
> The "old style" minified AMD file is available as `dist/index.umd.js` via various CDNs or package managers.

## Install via [npm](https://www.npmjs.com/package/lz-string)

```shell
$ npm install -g lz-string
$ lz-string input.txt > output.txt
```

## Home page

Home page for this program with examples, documentation and a live demo: http://pieroxy.net/blog/pages/lz-string/index.html

## Command line

If installed globally there is a command line tool available, and a test suite that can use it to show things are working properly. If other langauges build a command line tool that supports the same arguments then the test suite can be run against them too.

```console
$ lz-string -h
Usage: cli [options] [input-file]

Use lz-string to compress or decompress a file

Arguments:
  input-file                  file to process, if no file then read from stdin

Options:
  -V, --version               output the version number
  -d, --decompress            if unset then this will compress
  -e, --encoder <type>        character encoding to use (choices: "base64", "encodeduri", "raw", "uint8array", "utf16", default: "raw")
  -v, --verify                verify before returning (default: true)
  -b, --binary <file>         lz-string binary to use (default: "../dist/index.js")
  -l, --legacy                use legacy mode where uint8array decompression must be an even length
  -o, --output <output-file>  output file, otherwise write to stdout
  -q, --quiet                 don't print any error messages
  -h, --help                  display help for command
```

## Other languages

This lib has numerous ports to other languages, for server side processing, mostly. Here they are:

> [!CAUTION]
> These are all developed separately, so if you are using two versions to transfer data (such as a client and server version) it is important to check that they are compatible and have identical behaviours on the data!

> [!NOTE]
> Version 1.3.8 of this package had a slight change in the encoding which might impact compatibility.

- **Java:** [by Diogo Duailibe](https://github.com/diogoduailibe/lzstring4j)
- **Java:** [by rufushuang, with base64 support and better performances](https://github.com/rufushuang/lz-string4java)
- **C#:** [by Jawa-the-Hutt](https://github.com/jawa-the-hutt/lz-string-csharp)
- **C#:** [by kreudom, another implementation in C#, more up to date](https://github.com/kreudom/lz-string-csharp)
- **PHP:** [by nullpunkt](https://github.com/nullpunkt/lz-string-php)
- **Python3:** [by eduardtomasek](https://github.com/eduardtomasek/lz-string-python)
- **Another Python:** [by marcel-dancak](https://github.com/marcel-dancak/lz-string-python)
- **Ruby** [by Altivi](https://github.com/Altivi/lz_string)
- **Go** [I helped a friend to write a Go implementation of the decompression algorithm](https://github.com/pieroxy/lz-string-go)
- **Go** [Austin wrote the decompression part as well](https://github.com/Lazarus/lz-string-go)
- **Go** [by daku10, another implementation supports multiple encoding formats and can be used as a CLI tool](https://github.com/daku10/go-lz-string)
- **Elixir** [by Michael Shapiro](https://github.com/koudelka/elixir-lz-string)
- **C++/QT** [by AmiArt](https://github.com/AmiArt/qt-lzstring)
- **C++** [by Andrey Krasnov, another implementation in C++11](https://github.com/andykras/lz-string-cpp)
- **VB.NET** [by gsemac](https://github.com/gsemac/lz-string-vb)
- **Salesforce Apex** (Java like language): [bilal did the port](https://github.com/bilalfastian/LZ4String)
- **Kotlin:** [from Zen Liu](https://github.com/ZenLiuCN/lz-string4k)
- **Dart:** [from skipness](https://github.com/skipness/lzstring-dart)
- **Haxe:** [from markknol](https://github.com/markknol/hx-lzstring)
- **Rust:** [from adumbidiot](https://github.com/adumbidiot/lz-str-rs)
