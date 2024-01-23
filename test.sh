#! /usr/bin/env bash

ANSI_RESET="\033[0m"
ANSI_BOLD="\033[1m"
FG_RED="\033[31m"
FG_GREEN="\033[32m"
FG_YELLOW="\033[33m"

OPT_UPDATE=0
OPT_COMMAND=bin/cli.cjs
OPT_PREFIX=js
OPT_VERBOSE=-q

Help() {
    echo -e "\nUsage: $0 [-uh] [-c <command> -p <prefix>]"
    echo "-u:           Update any failed tests"
    echo "-c <command>: lz-string command to run (default: $OPT_COMMAND)"
    echo "-p <prefix>:  prefix for test results (required if setting a command)"
    echo "-v:           Show ls-string output and commands used"
    echo "-h:           Show this help"
    exit
}

# ---===###===--- Code starts here ---===###===--- #

ERROR_COMPRESS=0   # 1
ERROR_DECOMPRESS=0 # 2
ERROR_FILE=0       # 4
ERROR_HASH=0       # 8

while getopts ":huc:o:v" opt; do
    case ${opt} in
        h)
            Help
            ;;
        u)
            OPT_UPDATE=1
            echo "Updating test files"
            ;;
        c)
            if ! command -v "$OPTARG" &> /dev/null; then
                echo "$OPTARG could not be found"
                exit 1
            fi
            if [ "$OPT_PREFIX" = "js" ]; then
                OPT_PREFIX=""
            fi
            OPT_COMMAND="$OPTARG"
            echo "Using: $OPT_COMMAND"
            ;;
        p)
            OPT_PREFIX="${OPTARG//./}"
            echo "Prefix: $OPT_PREFIX"
            ;;
        v)
            OPT_VERBOSE=
            echo "Verbose"
            ;;
        *)
            echo "Invalid option: -$OPTARG" >&2
            Help
            exit 2
            ;;
    esac
done

if [ "$OPT_PREFIX" = "" ]; then
    echo "Invalid prefix: -$OPT_PREFIX" >&2
    Help
    exit 2
fi

RESULT=

# logging
verbose() {
    [ "$OPT_VERBOSE" = "" ] && echo $1
}

# file1, file2
compare() {
    if cmp -s $1 $2; then
        printf -v RESULT "    ${FG_GREEN}\xE2\x9C\x94${ANSI_RESET}   "
        return 0
    else
        printf -v RESULT "    ${FG_RED}\xE2\x9C\x98${ANSI_RESET}   "
        return 1
    fi
}

LAST_METHOD=
# method, data, compress, decompress, message
print_output() {
    local OUTPUT_METHOD=$1

    if [ "$LAST_METHOD" = "$1" ]; then
        OUTPUT_METHOD=""
    fi
    LAST_METHOD=$1

    printf "${ANSI_BOLD}%-12s${ANSI_RESET} %-10s %s %s %s\n" "$OUTPUT_METHOD" "$2" "$3" "$4" "$5"
}

# format, folder
process() {
    local OUTPUT=$(mktemp)
    local VALIDATE=$(mktemp)

    local OUTPUT_METHOD=
    local OUTPUT_DATA=
    local OUTPUT_COMPRESS=
    local OUTPUT_DECOMPRESS=
    local OUTPUT_MESSAGE=

    if [ ! -f "testdata/$2/$OPT_PREFIX/$1.bin" ] && [ $OPT_UPDATE -eq 0 ]; then
        printf "\n    Untested:   %-12s " "$1"
        printf " ...${FG_RED}%s${ANSI_RESET}" "no validation file"
        return
    fi

    OUTPUT_DATA=$1
    OUTPUT_METHOD=$2
    verbose "\$ $OPT_COMMAND -v $OPT_VERBOSE -f \"$1\" \"testdata/$2/data.bin\" -o $OUTPUT"
    $OPT_COMMAND -v $OPT_VERBOSE -f "$1" "testdata/$2/data.bin" -o $OUTPUT

    if [ ! -f "testdata/$2/$OPT_PREFIX/$1.bin" ]; then
        cp $OUTPUT "testdata/$2/$OPT_PREFIX/$1.bin"
        printf -v OUTPUT_MESSAGE "${FG_YELLOW}%s${ANSI_RESET}" "written"
    fi
    if ! compare "testdata/$2/$OPT_PREFIX/$1.bin" $OUTPUT; then
        ERROR_COMPRESS=1
        verbose "\$ $OPT_COMMAND $OPT_VERBOSE -d -f \"$1\" $OUTPUT -o $VALIDATE"
        $OPT_COMMAND $OPT_VERBOSE -d -f "$1" $OUTPUT -o $VALIDATE
        if cmp -s $VALIDATE "testdata/$2/data.bin"; then
            if [ ! -f "testdata/$2/$OPT_PREFIX/$1.bin" ] || [ $OPT_UPDATE -eq 1 ]; then
                cp $OUTPUT "testdata/$2/$OPT_PREFIX/$1.bin"
                printf -v OUTPUT_MESSAGE "${FG_YELLOW}%s${ANSI_RESET}" "updated"
            else
                printf -v OUTPUT_MESSAGE "${FG_RED}%s${ANSI_RESET}" "unsafe"
            fi
        else
            printf -v OUTPUT_MESSAGE "${FG_RED}%s${ANSI_RESET}" "validation failed"
        fi
    fi
    OUTPUT_COMPRESS=$RESULT

    verbose "\$ $OPT_COMMAND -v $OPT_VERBOSE -d -f \"$1\" \"testdata/$2/$OPT_PREFIX/$1.bin\" -o $OUTPUT"
    $OPT_COMMAND -v $OPT_VERBOSE -d -f "$1" "testdata/$2/$OPT_PREFIX/$1.bin" -o $OUTPUT
    if ! compare "testdata/$2/data.bin" $OUTPUT; then
        ERROR_DECOMPRESS=2
    fi
    OUTPUT_DECOMPRESS=" $RESULT "

    rm $OUTPUT $VALIDATE

    print_output "$OUTPUT_METHOD" "$OUTPUT_DATA" "$OUTPUT_COMPRESS" "$OUTPUT_DECOMPRESS" "$OUTPUT_MESSAGE"
}

# testdata/<name>
process_data() {
    if [ ! -f "testdata/$1/data.bin" ]; then
        printf "Error: ${FG_RED}%s${ANSI_RESET}\n" "No data found!"
        ERROR_FILE=4
        return
    fi

    if [ ! -f testdata/$1/data.sha256 ]; then
        shasum -a 256 "testdata/$1/data.bin" > "testdata/$1/data.sha256"
        printf "Info: ${FG_YELLOW}%s${ANSI_RESET}" "Created sha256 hash"
    elif ! shasum -s -c "testdata/$1/data.sha256"; then
        printf "Error: ${FG_RED}%s${ANSI_RESET}\n" "Invalid test data (sha256 hash incorrect)!"
        ERROR_HASH=8
        return
    fi
    if [ -f "testdata/$1/$OPT_PREFIX/data.sha256" ] && ! shasum -s -c "testdata/$1/$OPT_PREFIX/data.sha256"; then
        printf "Warning: ${FG_YELLOW}%s${ANSI_RESET}\n" "Invalid test results (sha256 hash incorrect)!"
    fi

    mkdir -p "testdata/$2/$OPT_PREFIX"

    process raw $1
    process base64 $1
    process encodeduri $1
    process uint8array $1
    process utf16 $1

    if [ "$(($ERROR_COMPRESS + $ERROR_DECOMPRESS + $ERROR_FILE + $ERROR_HASH))" = "0" ] && [ $OPT_UPDATE -eq 1 ]; then
        shasum -a 256 testdata/$1/$OPT_PREFIX/*.bin > "testdata/$1/$OPT_PREFIX/data.sha256"
    fi
}

printf "lz-string test runner\n\n"

print_output "" "Method" "Compress" "Decompress" "Message"

process_data all_ascii
process_data all_utf16
process_data hello_world
process_data lorem_ipsum
process_data pi
process_data repeated
process_data tattoo

echo ""

exit $(($ERROR_COMPRESS + $ERROR_DECOMPRESS + $ERROR_FILE + $ERROR_HASH))
