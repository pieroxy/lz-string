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

##Compressing JavaScript
1. Install lz-string globally with `npm install -g lz-string`.
2. Use the newly installed binary by passing it a file you'd like to encode, like a JavaScript file, `lz-string my.js`.  The encoded file will be printed to stdout, but you can easily redirect that to a file like so: `lz-string my.js > out.txt`.
3. Include the client side library in your HTML. `<script src="https://raw.githubusercontent.com/pieroxy/lz-string/master/libs/release/lz-string-decompress-1.3.3-min.js"></script>`.
4. Use XMLHttpRequest to fetch the encoded JS (`output.txt`).
5. Decoded encoded JS.
6. Create a script element, append decoded JS, append to DOM.

``javascript
var xhr = new XMLHttpRequest;
xhr.open('GET', 'output.txt');
xhr.onload = function () {
  var script = document.createElement('script');
  script.textContent = LZString.decompress(xhr.response);
  document.body.appendChild(script);
};
xhr.send();
``

###Warning
This technique will violate CSP for dynamically creating a new script node.  If you're not bound by CSP, then no worries.`

