#! /usr/bin/env bash

# These are the only options that should be overwritten by a profile
optDescription=""       # printed before the tests run, override from profiles
optCommand=""           # Cammand to run
optArgs=""              # Extra args needed
optDecompress=""        # suggested '-d'
optEncoder=""           # suggested '-e'
optEncoders=""          # comma separated potential encoders for $optEncoder
optOutput=""            # suggested '-o'
optQuiet=""             # suggested '-q'

# This must never be overridden by a profile!!!
optUpdate=""
optKeep=""

Help() {
    echo 'Usage: test.sh [options] [<profile>]'
    echo ''
    echo 'Run an lz-string command against a series of test data files'
    echo ''
    echo 'Arguments:'
    echo '  profile       Profile to load (must appear last)'
    echo ''
    echo 'Options:'
    echo '  -c <command>  lz-string command to run'
    echo '  -a <args>     Extra arguments to pass to the command'
    echo '  -d            Command supports "-d" decompress option'
    echo '  -e <encoder>  Command supports "-e" encoder option (choices: "base64", "encodeduri", "raw", "uint8array", "utf16", default: "raw")'
    echo '  -o            Command supports "-o" output option (otherwise capture from stdout)'
    echo '  -q            Command supports "-q" quiet option'
    echo '  -k            Keep test data, otherwise will cleanup after itself'
    echo '  -u            Update data if new, otherwise will throw an error'
    echo '  -h            Show this help'
    exit
}

# Ansi codes for reporting
ANSI_RESET="\033[0m"
ANSI_BOLD="\033[1m"
FG_RED="\033[31m"
FG_GREEN="\033[32m"
FG_YELLOW="\033[33m"
FG_CYAN="\033[36m"

testNameLength=8    # "TestData"
encoderNameLength=8 # "Encoding"

# Set to 1 if there are any errors
returnCode=0

while getopts ":ac:de:oqkuh" opt; do
    case ${opt} in
        h) Help ;;
        a) tmpArgs="$OPTARG" ;;
        c) tmpCommand="$OPTARG" ;;
        d) tmpDecompress="-d" ;;
        e) [ "$tmpEncoders" = "" ] && tmpEncoders="$OPTARG" || tmpEncoders="$tmpEncoders,$OPTARG" ;;
        o) tmpOutput="-o" ;;
        q) tmpQuiet="-q" ;;
        k) tmpKeep="1" ;;
        u) tmpUpdate="1" ;;
        *)
            echo "Invalid option: -$OPTARG" >&2
            Help
            exit 2
            ;;
    esac
done

# Load profile
shift $(($OPTIND - 1))
if [ "$1" != "" ]; then
    if [ ! -f "profiles/$1.sh" ]; then
        echo "profiles/$1.sh could not be found"
        exit 1
    fi
    source "profiles/$1.sh"
fi

#overwrite options from command line
optCommand=${tmpCommand:-$optCommand}
optArgs=${tmpArgs:-$optArgs}
optDecompress=${tmpDecompress:-$optDecompress}
# optEncoder=$optEncoder # see below
optEncoders=${tmpEncoders:-$optEncoders}
optOutput=${tmpOutput:-$optOutput}
optQuiet=${tmpQuiet:-$optQuiet}
optUpdate=$tmpUpdate # Don't allow a profile to override
optKeep=$tmpKeep # Don't allow a profile to override

if [ "$optCommand" = "" ]; then
    # Check we have a command to run
    printf "${FG_RED}Error:${ANSI_RESET} %s\n" "Command or profile required."
    Help
    exit 127
elif ! command -v "$optCommand" &> /dev/null; then
    # and that the command is valid
    printf "${FG_RED}Error:${ANSI_RESET} %s\n"  "$optCommand is not a valid command."
    exit 127
fi
if [ "$optEncoder" = "" ] && [ "$optEncoders" != "" ]; then
    if [ "$tmpEncoders" != "" ]; then
        # If we're setting on the commandline then follow the Help text argument
        optEncoder="-d"
    else
        # Otherwise we're using a profile and that needs to take precidence
        printf "${FG_RED}Error:${ANSI_RESET} %s\n" "Must specify an optEncoder argument if using multiple encoders (only possible via profiles)."
        exit 2
    fi
fi

# Redirects if no arguments for them
if [ "$optQuiet" = "" ]; then
    optQuiet="2>/dev/null"
fi
if [ "$optOutput" = "" ]; then
    optOutput=">"
fi

# method, data, compress, decompress, message
print_output() {
    local outputMethod=$1
    local outputEncoding=$2

    [ "$lastOutputMethod" = "$1" ] && outputMethod=""
    lastOutputMethod=$1

    case "$3" in
        pass) printf -v outputCompress "\xE2\x9C\x94" && outputCompressPrefix=$FG_GREEN ;;
        fail) printf -v outputCompress "\xE2\x9C\x98" && outputCompressPrefix=$FG_RED ;;
        error) printf -v outputCompress "\xE2\x80\xBC" && outputCompressPrefix=$FG_RED ;;
        skip) printf -v outputCompress "\xE2\x80\x93" && outputCompressPrefix=$FG_YELLOW ;;
        update) printf -v outputCompress "\xE2\x8A\x95" && outputCompressPrefix=$FG_GREEN ;;
        *) printf -v outputCompress "\xE2\x80\x88" && outputCompressPrefix=$FG_RED ;;
    esac

    case "$4" in
        pass) printf -v outputDecompress "\xE2\x9C\x94" && outputDecompressPrefix=$FG_GREEN ;;
        fail) printf -v outputDecompress "\xE2\x9C\x98" && outputDecompressPrefix=$FG_RED ;;
        error) printf -v outputDecompress "\xE2\x80\xBC" && outputDecompressPrefix=$FG_RED ;;
        skip) printf -v outputDecompress "\xE2\x80\x93" && outputDecompressPrefix=$FG_YELLOW ;;
        *) printf -v outputDecompress "\xE2\x80\x88" && outputDecompressPrefix=$FG_RED ;;
    esac

    printf "${ANSI_BOLD}%-${testNameLength}s${ANSI_RESET} %-${encoderNameLength}s ${outputCompressPrefix}%7s ${outputDecompressPrefix}%10s${ANSI_RESET}      %s\n" "$outputMethod" "$outputEncoding" "$outputCompress" "$outputDecompress" "$5"
}

# encoder, testdata
process() {
    local encodingName=${1:-raw}
    local encodingArg=${1:+"$optEncoder $1"} # Turn into an argument

    local outputMethod=$2
    local outputEncoder=$encodingName
    local outputCompress=
    local outputDecompress=
    local outputMessage=""

    local compressedFile="data/$outputMethod/$encodingName.compress.tmp"
    local decompressedFile="data/$outputMethod/$encodingName.decompress.tmp"

    if [ ! -f "data/$outputMethod/$encodingName.bin" ] && [ "$optUpdate" = "" ]; then
        printf -v outputMessage "${FG_RED}Error:${ANSI_RESET} no validation file"
    else
        # Test compression
        if ! eval $optCommand $optArgs $encodingArg "data/$outputMethod/data.bin" $optOutput $compressedFile $optQuiet; then
            outputCompress="error"
            returnCode=1
        elif [ ! -f "data/$outputMethod/$encodingName.bin" ]; then
            outputCompress="skip"
        elif cmp -s "data/$outputMethod/$encodingName.bin" $compressedFile; then
            outputCompress="pass"
        else
            outputCompress="fail"
            returnCode=1
        fi

        # Test decompression
        if [ "$optDecompress" != "" ]; then
            if ! eval $optCommand $optArgs -d $encodingArg $compressedFile $optOutput $decompressedFile $optQuiet; then
                outputDecompress="error"
                returnCode=1
            elif cmp -s "data/$outputMethod/data.bin" $decompressedFile; then
                outputDecompress="pass"
            else
                outputDecompress="fail"
                returnCode=1
            fi
        else
            outputDecompress="skip"
        fi

        # Write file if everything passes and we need to
        if [ ! -f "data/$outputMethod/$encodingName.bin" ]; then
            if [ "$returnCode" != "0" ]; then
                outputMessage="Unable to write validate compression"
            elif [ "$optUpdate" = "1" ]; then
                cp $compressedFile "data/$outputMethod/$encodingName.bin"
                outputCompress="update"
                outputMessage="Compressed file created"
            else
                returnCode=1
                outputCompress="pass"
                outputMessage="Compressed file doesn't exist"
            fi
        fi
    fi

    [ "$optKeep" = "" ] && rm -f $compressedFile $decompressedFile

    print_output "$outputMethod" "$outputEncoder" "$outputCompress" "$outputDecompress" "$outputMessage"
}

# data/<name>
process_data() {
    if [ ! -f "data/$1/data.bin" ]; then
        printf "Error: ${FG_RED}%s${ANSI_RESET}\n" "No test data found!"
        returnCode=1
    else
        if [ ! -f "data/$1/data.sha256" ]; then
            printf -v outputMessage "${FG_YELLOW}Warning:${ANSI_RESET} %s" "No valid validate hashes for $1"
            print_output "$1" "" "" "" "$outputMessage"
        else
            cd "data/$1"
            if ! shasum -q -s -c data.sha256 2>/dev/null; then
                printf -v outputMessage "${FG_RED}Error:${ANSI_RESET} %s" "Invalid hashes for $1"
                print_output "$1" "" "" "" "$outputMessage"
            fi
            cd ../..
        fi

        if [ "$optEncoder" = "" ] || [ "$optEncoders" = "" ]; then
            process "" $1
        else
            for encoder in ${optEncoders//,/ }; do
                process $encoder $1
            done
        fi

        if [ "$returnCode" = "0" ] && [ "$optUpdate" = "1" ]; then
            cd "data/$1"
            shasum -a 256 *.bin > data.sha256
            cd ../..
        fi
    fi
}

# Get the longest test name
for test in data/*; do
    if [ -d "$test" ]; then
        name="${test#data/}"
        length=${#name}
        if [ "$length" -gt "$testNameLength" ]; then
            testNameLength=$length
        fi
    fi
done

# Get the longest encoder name length
for encoder in ${optEncoders//,/ }; do
    length=${#encoder}
    if [ "$length" -gt "$encoderNameLength" ]; then
        encoderNameLength=$length
    fi
done

printf "lz-string testdata runner\n\n"

[ "$optDescription" != "" ] && printf "%s\n\n" "$optDescription"

printf "${FG_CYAN}%-${testNameLength}s %-${encoderNameLength}s Compress Decompress Message${ANSI_RESET}\n" "TestData" "Encoding"

for test in data/*; do
    if [ -d "$test" ]; then
        process_data "${test#data/}"
    fi
done

echo ""

exit $returnCode
