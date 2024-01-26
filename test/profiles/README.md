# Test profiles for the lz-string testdata runner

These are bash scripts, though they do not run directly (so no need to set the +x bit on them).

They can contain setup code for a version of lz-string that is to be tested.

There must be an executable file that has optional arguments (at a minimum it should take a filename and output binary `raw` compressed data to the console).

The profile should set a series of variables to define what the supplied command can do.

## Supported options

| Option          | Definition                                                                                                                                                                        |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `optComment`    | This is a comment to be printed before the tests are run - inform the user of what is being tested and any potential limitations.                                                 |
| `optCommand`    | The path and filename of the command to be run for each test data file.                                                                                                           |
| `optArgs`       | Any arguments required for this test (useful to alow a single executable to handle multiple versions, or enable verification of data inside the tool).                            |
| `optDecompress` | The argument required to decompress a file (recommended: `-d`)                                                                                                                    |
| `optEncoder`    | The argument required to select an encoder (recommended: `-e`)                                                                                                                    |
| `optEncoders`   | A comma separated list of encoders that the reference version supports, this will run against each separately using the above command (`base64,encodeduri,raw,uint8array,utf16`). |
| `optOutput`     | The argument required to specify an output file, otherwise stdout will be captured (recommended: `-o`).                                                                           |
| `optQuiet`      | The argument required to suppress any non-compressed logging, otherwise stderr will be redirected (recommended: `-q`).                                                            |

> [!NOTE]
> It is not possible to specify the arguments on the commandline due to the possibility of confusion on which is an argument for the tool and which for the command.
