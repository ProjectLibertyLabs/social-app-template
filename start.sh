#!/bin/bash
# Script to start all SAT services on the Frequency Paseo Testnet

BASE_DIR=${HOME}/.projectliberty
BASE_NAME=social-app-template

PCRE_GREP=
if grep -q -P "foo" 2>/dev/null
then
    PCRE_GREP=grep
else
    # Grep is not PCRE compatible, check for other greps
    if command -v ggrep >/dev/null # MacOS Homebrew might have ggrep
    then
        PCRE_GREP=ggrep
    elif command -v prce2grep > /dev/null # MacOS Homebrew could also have pcre2grep
    then
        PCRE_GREP=pcre2grep
    fi
fi

if [ -z "${PCRE_GREP}" ]
then
    cat << EOI
WARNING: No PCRE-capable 'grep' utility found; pretty terminal output disabled.

If you're on a Mac, try installing GNU grep:
    brew install grep

EOI
    OUTPUT=cat
else
    OUTPUT=box_text
fi

function box_text() {
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

    # Function to calculate the display width of a string considering some common wide characters
    function display_width() {
        local str="$1"
        local width=0
        local char

        for (( i=0; i<${#str}; i++ )); do
            char="${str:i:1}"
            if echo "$char" | ${PCRE_GREP} -P -q '[^\x{00}-\x{7F}]'; then
                # Emoji or symbol, assume it takes two columns
                width=$((width + 2))
            else
                # Regular character, assume it takes one column
                width=$((width + 1))
            fi
        done

        echo $width
    }

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

# Function to ask for input with a default value and write to ${ENV_FILE}
ask_and_save() {
    local var_name=${1}
    local prompt=${2}
    local default_value=${3}
    local hide_input=${4:-false}
    local value=
    local input=

    if [ -z "${default_value}" ]
    then
        if [ "${hide_input}" = true ]
        then
            read -rsp $'\n'"${prompt} (INPUT HIDDEN): " input
            echo
        else
            read -rp $'\n'"${prompt}: " input
        fi
        value=${input}
    else
        if [ "${hide_input}" = true ]
        then
            read -rsp $'\n'"${prompt} [${default_value}] (INPUT HIDDEN): " input
            echo
        else
            read -rp $'\n'"${prompt} [${default_value}]: " input
        fi
        value=${input:-$default_value}
    fi
    echo "${var_name}=\"${value}\"" >> ${ENV_FILE}
}

# Usage: ./start.sh [options]
# Options:
#   -h, --help                 Show this help message and exit
#   -n, --name                 Specify the project name

# Function to display help message
show_help() {
    echo "Usage: ./start.sh [options]"
    echo "Options:"
    echo "  -h, --help                 Show this help message and exit"
    echo "  -n, --name                 Specify the project name"
}


# Function to get user selection and return the hex value of the selected color
select_color() {
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

# Function to redact sensitive values in the .env file
redact_sensitive_values() {
    local env_file="$1"
    sed \
        -e 's/^PROVIDER_ACCOUNT_SEED_PHRASE=.*/PROVIDER_ACCOUNT_SEED_PHRASE=[REDACTED]/' \
        -e 's/^IPFS_BASIC_AUTH_USER=.*/IPFS_BASIC_AUTH_USER=[REDACTED]/' \
        -e 's/^IPFS_BASIC_AUTH_SECRET=.*/IPFS_BASIC_AUTH_SECRET=[REDACTED]/' \
        "$env_file"
}

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -h|--help) show_help; exit 0 ;;
        -n|--name) BASE_NAME="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; show_help; exit 1 ;;
    esac
    shift
done

if [ ! -d ${BASE_DIR} ]
then
    mkdir -p ${BASE_DIR}
fi

ENV_FILE=${BASE_DIR}/.env.${BASE_NAME}
COMPOSE_PROJECT_NAME=${BASE_NAME}

if [[ -n $ENV_FILE ]]; then
    echo -e "Using environment file: $ENV_FILE\n"
fi

# Check for Docker and Docker Compose
if ! command -v docker &> /dev/null || ! command -v docker compose &> /dev/null; then
    printf "Docker and Docker Compose are required but not installed. Please install them and try again.\n"
    exit 1
fi

# Load existing ${ENV_FILE} file if it exists
if [ -f ${ENV_FILE} ]; then
    echo -e "Found saved environment from a previous run:\n"
    redacted_content=$(redact_sensitive_values "${ENV_FILE}")
    echo "${redacted_content}"
    echo
    read -p  "Do you want to re-use the saved parameters? [Y/n]: " REUSE_SAVED
    REUSE_SAVED=${REUSE_SAVED:-y}

    if [[ ${REUSE_SAVED} =~ ^[Yy] ]]
    then
        ${OUTPUT} "Loading environment values from file..."
    else
        ${OUTPUT} "Removing previous saved environment..."

        rm ${ENV_FILE}
        # If the file fails to delete, exit the script
        if [ -f ${ENV_FILE} ]
        then
            ${OUTPUT} "Failed to remove previous saved environment. Exiting..."
        fi
    fi
fi

if [ ! -f ${ENV_FILE} ]
then
    ${OUTPUT} << EOI
Creating project environment file:
    ${ENV_FILE}
EOI
    # Setup some variables for easy port management
    read -p "Enter starting port for local port mapping (reserves a 20-port range) [3000]: " portno
    FRONTEND_PORT=${portno:-3000}
    echo "FRONTEND_PORT=${FRONTEND_PORT}" >> ${ENV_FILE}
    STARTING_PORT=$(( FRONTEND_PORT + 10 ))
    for i in {0..10}
    do
    eval SERVICE_PORT_${i}=$(( STARTING_PORT + i ))
    eval "export SERVICE_PORT_${i}=\${SERVICE_PORT_${i}}"
    eval "echo SERVICE_PORT_${i}=\${SERVICE_PORT_${i}}" >> ${ENV_FILE}
    done

    echo "COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME}" >> ${ENV_FILE}
    echo
    read -p "Enter a tag to use to pull the Gateway Docker images [latest]: " tag
    echo "DOCKER_TAG=${tag:-latest}" >> ${ENV_FILE}

    # Ask the user if they want to start on testnet or local
    echo
    read -p "Do you want to start on Frequency Paseo Testnet [y/N]: "
    echo
    [[ "${REPLY}" =~ ^[Yy]$ ]] && TESTNET_ENV=true || TESTNET_ENV=false
    echo "TESTNET_ENV=$TESTNET_ENV" >> ${ENV_FILE}

    if [ $TESTNET_ENV = true ]
    then
    ${OUTPUT} << EOI
Setting defaults for testnet...
Hit <ENTER> to accept the default value or enter new value and then hit <ENTER>

EOI
        DEFAULT_FREQUENCY_URL="wss://0.rpc.testnet.amplica.io"
        DEFAULT_FREQUENCY_HTTP_URL="https://0.rpc.testnet.amplica.io"
        DEFAULT_PROVIDER_ID=
        DEFAULT_PROVIDER_ACCOUNT_SEED_PHRASE=
    else
        echo -e "\nStarting on local..."
        DEFAULT_FREQUENCY_URL="ws://frequency:9944"
        DEFAULT_FREQUENCY_HTTP_URL="http://localhost:9944"
        DEFAULT_PROVIDER_ID="1"
        DEFAULT_PROVIDER_ACCOUNT_SEED_PHRASE="//Alice"
    fi
    DEFAULT_IPFS_ENDPOINT="http://ipfs:5001"
    DEFAULT_IPFS_VOLUME="/data/ipfs"
    DEFAULT_IPFS_GATEWAY_URL='https://ipfs.io/ipfs/[CID]'
    DEFAULT_IPFS_BASIC_AUTH_USER=""
    DEFAULT_IPFS_BASIC_AUTH_SECRET=""
    DEFAULT_IPFS_UA_GATEWAY_URL="http://localhost:8080"
    DEFAULT_CONTENT_DB_VOLUME="content_db"

    # Allow different instances to have different banner titles
    ask_and_save REACT_APP_TITLE "Enter the title of the application" "Social Web Demo"

    # Allow different instances to have different background colors in the header
    echo
${OUTPUT} << EOI
Select the background color of the header:
EOI
    selected_color_hex=$(select_color)
    echo "REACT_APP_HEADER_BG_COLOR=${selected_color_hex}" >> ${ENV_FILE}

    ask_and_save FREQUENCY_URL "Enter the Frequency RPC URL" "$DEFAULT_FREQUENCY_URL"
    ask_and_save FREQUENCY_HTTP_URL "Enter the Frequency HTTP RPC URL" "$DEFAULT_FREQUENCY_HTTP_URL"
    echo
    if [ ${TESTNET_ENV} = true ]
    then
${OUTPUT} << EOI
🔗💠📡                                                                           📡💠🔗
🔗💠📡   A Provider is required to start the services.                           📡💠🔗
🔗💠📡                                                                           📡💠🔗
🔗💠📡   If you need to become a provider, visit                                 📡💠🔗
🔗💠📡   https://provider.frequency.xyz/ to get a Provider ID.                   📡💠🔗
🔗💠📡                                                                           📡💠🔗

EOI
        ask_and_save PROVIDER_ID "Enter Provider ID" "$DEFAULT_PROVIDER_ID"
        ask_and_save PROVIDER_ACCOUNT_SEED_PHRASE "Enter Provider Seed Phrase" "$DEFAULT_PROVIDER_ACCOUNT_SEED_PHRASE" true
    else
        echo "PROVIDER_ID=1" >> ${ENV_FILE}
        echo "PROVIDER_ACCOUNT_SEED_PHRASE=\"//Alice\"" >> ${ENV_FILE}
    fi
    ${OUTPUT} << EOI
The default configuration runs a local, containerized IPFS node.
This configuration will likely have trouble propagating content to the global IPFS
network.

If you want to test between multiple instances of Gateway operating on a public blockchain
(ie, Testnet or Mainnet), it is recommended to use an external IPFS pinning service.

EOI
    EXTERNAL_IPFS=0
    read -p "Do you want to configure an external IPFS service [y/N]? " CHANGE_IPFS_SETTINGS

    if [[ $CHANGE_IPFS_SETTINGS =~ ^[Yy]$ ]]
    then
        EXTERNAL_IPFS=1
        ask_and_save IPFS_ENDPOINT "Enter the IPFS Endpoint" "$DEFAULT_IPFS_ENDPOINT"
        ask_and_save IPFS_GATEWAY_URL "Enter the IPFS Gateway URL" "$DEFAULT_IPFS_GATEWAY_URL"
        ask_and_save IPFS_BASIC_AUTH_USER "Enter the IPFS Basic Auth User" "$DEFAULT_IPFS_BASIC_AUTH_USER" true
        ask_and_save IPFS_BASIC_AUTH_SECRET "Enter the IPFS Basic Auth Secret" "$DEFAULT_IPFS_BASIC_AUTH_SECRET" true
        ask_and_save IPFS_UA_GATEWAY_URL "Enter the browser-resolveable IPFS UA Gateway URL" "$DEFAULT_IPFS_UA_GATEWAY_URL"
    else
    # Add the IPFS settings to the .env-saved file so defaults work with local testing
    # Edit "IPFS_VOLUME" if you want to cache IPFS content in a local directory instead of the internal Docker volume
        cat >> ${ENV_FILE} << EOI
IPFS_VOLUME="ipfs_data"
IPFS_ENDPOINT="${DEFAULT_IPFS_ENDPOINT}"
IPFS_GATEWAY_URL="${DEFAULT_IPFS_GATEWAY_URL}"
IPFS_BASIC_AUTH_USER="${DEFAULT_IPFS_BASIC_AUTH_USER}"
IPFS_BASIC_AUTH_SECRET="${DEFAULT_IPFS_BASIC_AUTH_SECRET}"
IPFS_UA_GATEWAY_URL="${DEFAULT_IPFS_UA_GATEWAY_URL}"
EOI
    fi

    echo "EXTERNAL_IPFS=${EXTERNAL_IPFS}" >> ${ENV_FILE}

    # When testing with gateway services it may be useful to use docker containers that have been built locally
    # Setting `DEV_CONTAINERS` to `true` will use the local docker containers
    echo "DEV_CONTAINERS=false" >> ${ENV_FILE}

    # Edit `CONTENT_DB_VOLUME` to change the location of the content database, the default is a docker volume
    echo "CONTENT_DB_VOLUME=\"$DEFAULT_CONTENT_DB_VOLUME\"" >> ${ENV_FILE}
fi
set -a; source ${ENV_FILE}; set +a

COMPOSE_FILES="-f docker-compose.yaml"
PROFILES="--profile backend --profile frontend"
if [ "${DEV_CONTAINERS}" = true ]
then
    COMPOSE_FILES="${COMPOSE_FILES} -f docker-compose.dev-images.yaml"
fi
if [ ${EXTERNAL_IPFS} = 0 ]
then
    COMPOSE_FILES="${COMPOSE_FILES} -f docker-compose.local-ipfs.yaml"
fi

if [ $TESTNET_ENV != true ]
then
    COMPOSE_FILES="${COMPOSE_FILES} -f docker-compose.local-frequency.yaml"
    PROFILES="${PROFILES} --profile local-node"
fi

if [ $DEV_CONTAINERS = true ]
then
    # Start specific services in detached mode
    echo -e "\nStarting services with local docker containers... [DEV_CONTAINERS==true]"
else
    # Start all services in detached mode
    echo -e "\nStarting all services..."
fi

docker compose ${COMPOSE_FILES} ${PROFILES} up -d social-app-template-frontend
if [ ${TESTNET_ENV} != true ]
then
    # Run npm run local:init
    echo "Running npm run local:init to provision Provider with capacity, etc..."
    ( cd backend && npm run local:init )
fi

${OUTPUT} << EOI
🚀 You can access the Social App Template at http://localhost:${FRONTEND_PORT} 🚀
EOI
