#! /usr/bin/env bash

ANSI_RESET="\033[0m"

FG_RED="\033[31m"
FG_GREEN="\033[32m"
FG_YELLOW="\033[33m"

OPT_UPDATE=0
OPT_COMMAND=bin/cli.cjs
OPT_PREFIX=js

Help() {
    echo -e "\nUsage: $0 [-uh] [-c <command> -p <prefix>]"
    echo "-u:           Update any failed tests"
    echo "-c <command>: lz-string command to run (default: $OPT_COMMAND)"
    echo "-p <prefix>:  prefix for test results (required if setting a command)"
    echo "-h:           Show this help"
    exit
}

# ---===###===--- Code starts here ---===###===--- #

while getopts ":huc:o:" opt; do
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

# file1, file2, success
compare() {
    if cmp -s $1 $2; then
        printf " ...${FG_GREEN}%s${ANSI_RESET}" "pass"
        return 0
    else
        printf " ...${FG_RED}%s${ANSI_RESET}" "fail"
        return 1
    fi
}

# format, folder
process() {
    local OUTPUT=$(mktemp)
    local VALIDATE=$(mktemp)

    if [ ! -f "testdata/$2/$OPT_PREFIX/$1.bin" ] && [ $OPT_UPDATE -eq 0 ]; then
        printf "\n    Untested:   %-12s " "$1"
        printf " ...${FG_RED}%s${ANSI_RESET}" "no validation file"
        return
    fi

    mkdir -p "testdata/$2/$OPT_PREFIX"

    printf "\n    Compress:   %-12s " "$1"
    $OPT_COMMAND -v -q -f "$1" < "testdata/$2/data.bin" > $OUTPUT

    if [ ! -f "testdata/$2/$OPT_PREFIX/$1.bin" ]; then
        cp $OUTPUT "testdata/$2/$OPT_PREFIX/$1.bin"
        printf " ...${FG_YELLOW}%s${ANSI_RESET}" "written"
    fi
    if ! compare "testdata/$2/$OPT_PREFIX/$1.bin" $OUTPUT; then
        $OPT_COMMAND -q -d -f "$1" < $OUTPUT > $VALIDATE
        if cmp -s $VALIDATE "testdata/$2/data.bin"; then
            if [ ! -f "testdata/$2/$OPT_PREFIX/$1.bin" ] || [ $OPT_UPDATE -eq 1 ]; then
                cp $OUTPUT "testdata/$2/$OPT_PREFIX/$1.bin"
                printf " ...${FG_YELLOW}%s${ANSI_RESET}" "updated"
            else
                printf " ...${FG_RED}%s${ANSI_RESET}" "unsafe"
            fi
        else
            printf " ...${FG_RED}%s${ANSI_RESET}" "validation failed"
        fi
    fi

    printf "\n    Decompress: %-12s " "$1"
    $OPT_COMMAND -v -q -d -f "$1" < "testdata/$2/$OPT_PREFIX/$1.bin" > $OUTPUT
    compare "testdata/$2/data.bin" $OUTPUT

    rm $OUTPUT $VALIDATE
}

# testdata/<name>
process_data() {
    printf "Running against %s..." "$1"

    process raw $1
    printf " (note that testing raw decoding is currently unsupported)" # binary file loading issues in nodejs

    process base64 $1

    process encodeduri $1

    process uint8array $1
    printf " (note that testing uint8array decoding is currently unsupported)" # binary file loading issues in nodejs

    process utf16 $1

    printf "\n...Complete\n\n"
}

printf "lz-string test runner\n\n"

process_data tattoo
process_data lorem_ipsum

printf "Done\n"
