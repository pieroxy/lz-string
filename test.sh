#! /usr/bin/env bash

ANSI_RESET="\033[0m"

FG_RED="\033[31m"
FG_GREEN="\033[32m"
FG_YELLOW="\033[33m"

Help() {
    echo -e "\nUsage: $0 [-u]"
    echo "-h: Show this help"
    echo "-u: Update any failed tests"
    exit
}

OPT_UPDATE=0

# ---===###===--- Code starts here ---===###===--- #

while getopts ":hu" opt; do
    case ${opt} in
        "h") Help ;;
        "u") OPT_UPDATE=1 ; echo "Updating test files" ;;
    esac
done

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
    OUTPUT=$(mktemp)
    VALIDATE=$(mktemp)

    printf "\nCompress:   %-12s " $1
    node bin/cli.cjs -v -q -f $1 testdata/$2/source.bin -o $OUTPUT
    if ! compare testdata/$2/$1.bin $OUTPUT; then
        node bin/cli.cjs -q -d -f $1 $OUTPUT -o $VALIDATE
        if cmp -s $VALIDATE testdata/$2/source.bin; then
            if [ ! -f testdata/$2/$1.bin ] || [ $OPT_UPDATE -eq 1 ]; then
                cp $OUTPUT testdata/$2/$1.bin
                printf " ...${FG_YELLOW}%s${ANSI_RESET}" "updated"
            else
                printf " ...${FG_RED}%s${ANSI_RESET}" "unsafe"
            fi
        else
            printf " ...${FG_RED}%s${ANSI_RESET}" "validation failed"
        fi
    fi

    printf "\nDecompress: %-12s " $1
    node bin/cli.cjs -v -q -d -f $1 testdata/$2/$1.bin -o $OUTPUT
    compare testdata/$2/source.bin $OUTPUT

    rm $OUTPUT $VALIDATE
}

# process raw tattoo
process base64 tattoo
process encodeduri tattoo
# process uint8array tattoo
process utf16 tattoo

printf "\n\nDone\n"