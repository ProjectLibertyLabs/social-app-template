#!/bin/bash

BASE_DIR=${HOME}/.projectliberty
BASE_NAME=social-app-template

ALL_PROFILES="account graph content_publishing content_watcher backend frontend"
BACKEND_ONLY_PROFILES="account graph content_publishing content_watcher backend"
COMPOSE_FILES="docker-compose.yaml"
PROFILES=""
BOX_WIDTH=96

###################################################################################
#  Wrangle grep because MacOS doesn't come with a PCRE-enabled grep by default.
#  If we don't find one, disable our "pretty" output function.
###################################################################################
PCRE_GREP=
if echo "foobar" | grep -q -P "foo(?=bar)" >/dev/null 2>&1; then
    PCRE_GREP=grep
else
    # Grep is not PCRE compatible, check for other greps
    if command -v ggrep >/dev/null; then # MacOS Homebrew might have ggrep
        PCRE_GREP=ggrep
    elif command -v pcre2grep > /dev/null; then # MacOS Homebrew could also have pcre2grep
        PCRE_GREP=pcre2grep
    fi
fi

if [ -z "${PCRE_GREP}" ]; then
    cat << EOI
WARNING: No PCRE-capable 'grep' utility found; pretty terminal output disabled.

If you're on a Mac, try installing GNU grep:
    brew install grep

EOI
  read -p 'Press any key to continue... '

  OUTPUT='echo -e'
else
  OUTPUT="box_text -w ${BOX_WIDTH}"
fi

###################################################################################
# yesno
#
# Description: Prompt the user with a question requiring a yes/no response. The
#              prompt will be augmented with "? [y/n]: " (with capitalization reflecting
#              the default response if the user just hits <Enter>)
#
# ${1} - Prompt string
# ${2} - Default if response is empty (only first character matters)
###################################################################################
function yesno() {
    DEFAULT=Y
    DEFAULT_STR="Y/n"
    if [ $# -gt 1 ]; then
        if [[ ${2} =~ ^[^Yy] ]]; then
            DEFAULT_STR="y/N"
            DEFAULT=N
        fi
    fi
    echo
    read -n 1 -p "${1}? [${DEFAULT_STR}]: "
    echo
    if [[ ${REPLY} =~ ^[Yy]$ ]] ; then
        return 0
    elif [ -z "${REPLY}" -a ${DEFAULT} = Y ]; then
        return 0
    fi

    return 1
}

# Internal function to calculate the display width of a string considering some common wide characters
function display_width() {
    local str="$1"
    local width=0
    local char

    for (( i=0; i<${#str}; i++ )); do
        char="${str:i:1}"
        if [ -z ${PCRE_GREP} ]; then
          # Regular character, assume it takes one column
          width=$((width + 1))
        else
          if echo "$char" | ${PCRE_GREP} -P -q '[^\x{00}-\x{7F}]' ; then
            width=$((width + 2))
          else
            # Regular character, assume it takes one column
            width=$((width + 1))
          fi
        fi
    done

    echo $width
}



###################################################################################
# box_text
#
# Description: Output text surrounded by a box; padded with blank lines inside the
#              top and bottom edges. If TEXT is omitted, it will read from stdin.
#
# Usage: box_text [-w <min_width>] [TEXT]
#
#    min_width - Pad the output text box to a least min_width characters.
#                Default: do not pad
###################################################################################
box_text() {
    local input
    local min_width=0

    # Parse the optional -w argument
    while getopts ":w:" opt; do
        case $opt in
            w)
                min_width=$OPTARG
                ;;
            \?)
                echo "Invalid option: -$OPTARG" >&2
                return 1
                ;;
            :)
                echo "Option -$OPTARG requires an argument." >&2
                return 1
                ;;
        esac
    done
    shift $((OPTIND - 1))


    if [ -z "$1" ]; then
        # Read input from stdin if no arguments are provided
        input=$(cat)
    else
        # Use the provided argument as input
        input="$1"
    fi

    local IFS=$'\n'
    # local lines=($input)
    local lines=()

    # Read the string into the array, preserving empty lines
    while IFS= read -r line || [[ -n $line ]]; do
        lines+=("$line")
    done <<< "${input}"

    local max_length=0

    # Find the maximum length of a line, accounting for Unicode width
    for line in "${lines[@]}"; do
        line_length=$(display_width "$line")
        if [ $line_length -gt $max_length ]; then
            max_length=$line_length
        fi
    done

    # Ensure the box width is at least the specified minimum width
    max_length=$(( max_length > min_width ? max_length : min_width ))

    # Top border
    echo "┌$(printf '─%.0s' $(seq 1 $((max_length + 2))))┐"

    # Print each line with padding
    for line in "${lines[@]}"; do
        printf "│ %-${max_length}s │\n" "$line"
    done

    # Bottom border
    echo "└$(printf '─%.0s' $(seq 1 $((max_length + 2))))┘"
}

###################################################################################
# box_text_attention
#
# Description: Like box texty, but output is surrounded by a box;
# padded with blank lines and attention-getting characters.
# ##################################################################################
box_text_attention() {
    local input
    local min_width=0
    local attention=false

    # Parse the optional -w argument
    while getopts ":w:" opt; do
        case $opt in
            w)
                min_width=$OPTARG
                ;;
            \?)
                echo "Invalid option: -$OPTARG" >&2
                return 1
                ;;
            :)
                echo "Option -$OPTARG requires an argument." >&2
                return 1
                ;;
        esac
    done
    shift $((OPTIND - 1))


    if [ -z "$1" ]; then
        # Read input from stdin if no arguments are provided
        input=$(cat)
    else
        # Use the provided argument as input
        input="$1"
    fi

    local IFS=$'\n'
    # local lines=($input)
    local lines=()

    # Read the string into the array, preserving empty lines
    while IFS= read -r line || [[ -n $line ]]; do
        lines+=("$line")
    done <<< "${input}"

    local max_length=0

    # Find the maximum length of a line, accounting for Unicode width
    for line in "${lines[@]}"; do
        line_length=$(display_width "$line")
        if [ $line_length -gt $max_length ]; then
          max_length=$line_length
        fi
    done

    # Ensure the box width is at least the specified minimum width
    max_length=$(( max_length > min_width ? max_length : min_width ))

    # Top border
    echo "┌$(printf '─%.0s' $(seq 1 $((max_length + 10))))┐"
    echo "│ 🔗💠📡$(printf ' %.0s' $(seq 1 $((max_length + 2)))) │"

    # Print each line with padding
    for line in "${lines[@]}"; do
        real_length=$(( max_length ))
        printf "│ 🔗💠📡  %-${real_length}s │\n" "$line"
    done

    # Bottom border
    echo "│ 🔗💠📡$(printf ' %.0s' $(seq 1 $((max_length + 2)))) │"
    echo "└$(printf '─%.0s' $(seq 1 $((max_length + 10))))┘"
}

###################################################################################
# ask_and_save
#
# Description: Prompt the user with a string, and save the response to the environment file
#
# ${1} - env var name to save to the ENV_FILE
# ${2} - prompt string
# ${3} - [optional] default response if user hits <Enter>
# ${4} - [optional] hide input if true (Default: false)
###################################################################################
ask_and_save() {
    local var_name=${1}
    local prompt=${2}
    local default_value=${3}
    local hide_input=${4:-false}
    local value=
    local input=

    if [ -z "${default_value}" ]; then
        if [ "${hide_input}" = true ]; then
            read -rsp $'\n'"${prompt} (INPUT HIDDEN): " input
            echo
        else
            read -rp $'\n'"${prompt}: " input
        fi
        value=${input}
    else
        if [ "${hide_input}" = true ]; then
            read -rsp $'\n'"${prompt} [${default_value}] (INPUT HIDDEN): " input
            echo
        else
            read -rp $'\n'"${prompt} [${default_value}]: " input
        fi
        value=${input:-$default_value}
    fi
    # Make the variable available in the current shell, useful for subsequent commands
    export ${var_name}="${value}"
    echo "${var_name}=\"${value}\"" >> ${ENV_FILE}
}

###################################################################################
# select_color
#
# Description: Function to get user selection and return the hex value of the selected color
#
###################################################################################
function select_color() {
    # Define color options
    declare -a color_names=("White" "Light Gray" "Light Yellow" "Light Blue" "Light Green" )
    declare -a color_values=("#FFFFFF" "#D3D3D3" "#FFFFE0" "#ADD8E6" "#90EE90")

    PS3=$'\nEnter the number of the color you want: '

    select color in "${color_names[@]}"; do
        if [[ -n "$color" ]]; then
            for i in "${!color_names[@]}"; do
                if [[ "${color_names[$i]}" = "${color}" ]]; then
                    echo "${color_values[$i]}"
                    return 0
                fi
            done
        else
            echo "Invalid selection. Please try again."
        fi
    done
}

###################################################################################
# redact_sensitive_values
#
# Description: Runs a 'sed' command on the input file to replace specific environment
#              values with "[REDACTED]". Useful for not exposing secrets in live demos.
#
###################################################################################
function redact_sensitive_values() {
    local env_file="$1"
    sed \
        -e 's/^PROVIDER_ACCOUNT_SEED_PHRASE=.*/PROVIDER_ACCOUNT_SEED_PHRASE=[REDACTED]/' \
        -e 's/^IPFS_BASIC_AUTH_USER=.*/IPFS_BASIC_AUTH_USER=[REDACTED]/' \
        -e 's/^IPFS_BASIC_AUTH_SECRET=.*/IPFS_BASIC_AUTH_SECRET=[REDACTED]/' \
        "$env_file"
}

###################################################################################
#
# Description: Save a name/value pair to the environment file & simultaneously
#              export to the current environment.
#
# ${1} - env variable name
# ${2} - env variable value
#
###################################################################################
function export_save_variable() {
    local variable_name=$1
    local value=$2

    echo "${variable_name}=\"${value}\"" >> ${ENV_FILE}
    export ${variable_name}="${value}"
}

###################################################################################
# prefix_postfix_values
#
# Description: Given a list of values in ${1} separated by IFS, return a composite string
#              consisting of each value, prefixed by ${2} and postfixed by ${3}.
#
###################################################################################
function prefix_postfix_values() {
    str=""
    for val in ${1}; do
        str="${str} ${2}${val}${3}"
    done

    echo ${str}
}

###################################################################################
# is_frequency_ready
#
# Description: Runs a command to check the health status of the 'frequency' service
#
###################################################################################
function is_frequency_ready {
    health=$( docker compose -p ${COMPOSE_PROJECT_NAME} ps --format '{{.Health}}' frequency )
    if [ "${health}" = 'healthy' ]; then
        return 0
    fi

    return 1
}
