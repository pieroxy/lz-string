# lz-string test data runner

This is the folder for the lz-string test runner.

The project itself also makes use of this data for internal testing.

## Test Strategy

There are ports to other languages, but beyond being informed that they are compatible, there is not actually any empirical testing to confirm this.

The test suite was created in order to ensure that developers can confirm that their implementation meets the standard.

Each implementation can have a [profile](./profile) created for setting up and running the tests against a command-line utility.

Every data source and compressed data file is hashed for peace of mind (and should more encoding strategies or data sources get added these will automatically get used).

## `test.sh` Script

The test script is designed to be run from within this folder, and is not included in the `npm` package due to its size (currently around 2mb of test data).

```console
$ ./test.sh -h
Usage: test.sh [options] [<profile>]

Run an lz-string command against a series of test data files

Arguments:
  profile       Profile to load (must appear last)

Options:
  -c <command>  lz-string command to run
  -a <args>     Extra arguments to pass to the command
  -d            Command supports "-d" decompress option
  -e <encoder>  Command supports "-e" encoder option (choices: "base64", "encodeduri", "raw", "uint8array", "utf16", default: "raw")
  -o            Command supports "-o" output option (otherwise capture from stdout)
  -q            Command supports "-q" quiet option
  -k            Keep test data, otherwise will cleanup after itself
  -u            Update data if new, otherwise will throw an error
  -h            Show this help
```

> [!TIP]
> When running the script directly it is far more limited, with the options being simple flags, while writing a profile allows setting specific arguments.

> ![NOTE]
> The `-u` option (update) can only **create** data files, it will not overwrite them. If a set of encodings for all folder all succeed it will also update the hash for that folder.

## Profiles

Each profile is a (bash) shell script that can setup the environment and then provide information for the test script to use when running, see the [profile](./profile) page for details.

## Output

The command will run each encoder against all test data files (the `data.bin` files inside each `data/` folder).

Potential results:

- `‼` Failure - error from the command.
- `✘` Failure - data doesn't match.
- `✔` Success - data matches.
- `⊕` Success - new data file created.
- `–` Skip - no data file to compare against (and no permission to write).

If there are any errors then it will display them in the `Message` column.

### Sample Output

```console
$ ./test.sh js
lz-string testdata runner

Running using the ESModule build of lz-string

TestData    Encoding   Compress Decompress Message
all_ascii   base64         ✔        ✔
            encodeduri     ✔        ✔
            raw            ✔        ✔
            uint8array     ✔        ✔
            utf16          ✔        ✔
all_utf16   base64         ✔        ✔
            encodeduri     ✔        ✔
            raw            ✔        ✔
            uint8array     ✔        ✔
            utf16          ✔        ✔
hello_world base64         ✔        ✔
            encodeduri     ✔        ✔
            raw            ✔        ✔
            uint8array     ✔        ✔
            utf16          ✔        ✔
lorem_ipsum base64         ✔        ✔
            encodeduri     ✔        ✔
            raw            ✔        ✔
            uint8array     ✔        ✔
            utf16          ✔        ✔
pi          base64         ✔        ✔
            encodeduri     ✔        ✔
            raw            ✔        ✔
            uint8array     ✔        ✔
            utf16          ✔        ✔
repeated    base64         ✔        ✔
            encodeduri     ✔        ✔
            raw            ✔        ✔
            uint8array     ✔        ✔
            utf16          ✔        ✔
tattoo      base64         ✔        ✔
            encodeduri     ✔        ✔
            raw            ✔        ✔
            uint8array     ✔        ✔
            utf16          ✔        ✔
```
