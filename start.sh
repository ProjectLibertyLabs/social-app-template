#!/bin/bash
# Script to start all SAT services on the Frequency Paseo Testnet

ENV_FILE=.env-saved
COMPOSE_PROJECT_NAME=gateway

# Function to ask for input with a default value and write to ${ENV_FILE}
ask_and_save() {
    local var_name=${1}
    local prompt=${2}
    local default_value=${3}
    read -rp $'\n'"${prompt} [${default_value}]: " input
    local value=${input:-$default_value}
    echo "${var_name}=\"${value}\"" >> ${ENV_FILE}
}

# Check for Docker and Docker Compose
if ! command -v docker &> /dev/null || ! command -v docker compose &> /dev/null; then
    printf "Docker and Docker Compose are required but not installed. Please install them and try again.\n"
    exit 1
fi

if [ -n "${1}" ]; then
    ENV_FILE=${1}
fi

if [ -n "${2}" ]; then
    COMPOSE_PROJECT_NAME=${2}
fi

# Load existing ${ENV_FILE} file if it exists
if [ -f ${ENV_FILE} ]; then
    echo -e "Found saved environment from a previous run:\n"
    cat ${ENV_FILE}
    echo
    read -p  "Do you want to re-use the saved parameters? [Y/n]: " REUSE_SAVED
    REUSE_SAVED=${REUSE_SAVED:-y}

    if [[ ${REUSE_SAVED} =~ ^[Yy] ]]
    then
        cat << EOI
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Loading existing ${ENV_FILE} file environment values...                                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
EOI
    else
        cat << EOI
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Removing previous saved environment...                                                      |
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
EOI
    rm ${ENV_FILE}
    fi
fi

if [ ! -f ${ENV_FILE} ]
then
    # Setup some variables for easy port management
    read -p "Enter starting port for local port mapping [3010]: " portno
    STARTING_PORT=${portno:-3010}
    for i in {0..10}
    do
    eval SERVICE_PORT_${i}=$(( STARTING_PORT + i ))
    eval "export SERVICE_PORT_${i}=\${SERVICE_PORT_${i}}"
    eval "echo SERVICE_PORT_${i}=\${SERVICE_PORT_${i}}" >> ${ENV_FILE}
    done

    # Create ${ENV_FILE} file to store environment variables
    cat << EOI
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Creating ${ENV_FILE} file to store environment variables...                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

EOI
    echo "COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME}" >> ${ENV_FILE}
    read -p "Enter a tag to use to pull the Gateway Docker images [latest]: " tag
    echo "DOCKER_TAG=${tag:-latest}" >> ${ENV_FILE}
    # Ask the user if they want to start on testnet or local
    read -p "Do you want to start on Frequency Paseo Testnet [y/N]:" TESTNET_ENV
    echo "TESTNET_ENV=\"$TESTNET_ENV\"" >> ${ENV_FILE}

    if [[ $TESTNET_ENV =~ ^[Yy]$ ]]
    then
    cat << EOI

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Setting defaults for testnet...                                                             ┃
┃ Hit <ENTER> to accept the default value or enter new value and then hit <ENTER>             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

EOI
        DEFAULT_TESTNET_ENV="testnet"
        DEFAULT_FREQUENCY_URL="wss://0.rpc.testnet.amplica.io"
        DEFAULT_FREQUENCY_HTTP_URL="https://0.rpc.testnet.amplica.io"
        DEFAULT_PROVIDER_ID="INPUT REQUIRED"
        DEFAULT_PROVIDER_ACCOUNT_SEED_PHRASE="INPUT REQUIRED"
    else
        echo -e "\nStarting on local..."
        DEFAULT_TESTNET_ENV="local"
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


    ask_and_save FREQUENCY_URL "Enter the Frequency Testnet RPC URL" "$DEFAULT_FREQUENCY_URL"
    ask_and_save FREQUENCY_HTTP_URL "Enter the Frequency HTTP Testnet RPC URL" "$DEFAULT_FREQUENCY_HTTP_URL"
cat << EOI

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🔗💠📡                                                                           📡💠🔗   ┃
┃   🔗💠📡   A Provider is required to start the services.                           📡💠🔗   ┃
┃   🔗💠📡                                                                           📡💠🔗   ┃
┃   🔗💠📡   If you need to become a provider, visit                                 📡💠🔗   ┃
┃   🔗💠📡   https://provider.frequency.xyz/ to get a Provider ID.                   📡💠🔗   ┃
┃   🔗💠📡                                                                           📡💠🔗   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

EOI
    ask_and_save PROVIDER_ID "Enter Provider ID" "$DEFAULT_PROVIDER_ID"
    ask_and_save PROVIDER_ACCOUNT_SEED_PHRASE "Enter Provider Seed Phrase" "$DEFAULT_PROVIDER_ACCOUNT_SEED_PHRASE"
    cat << EOI

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Do you want to change the IPFS settings [y/N]:                                              ┃
┃                                                                                             ┃
┃ Suggestion: Change to an IPFS Pinning Service for better persistence and availability       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

EOI
    read CHANGE_IPFS_SETTINGS

    if [[ $CHANGE_IPFS_SETTINGS =~ ^[Yy]$ ]]
    then
        ask_and_save IPFS_VOLUME "Enter the IPFS volume" "$DEFAULT_IPFS_VOLUME"
        ask_and_save IPFS_ENDPOINT "Enter the IPFS Endpoint" "$DEFAULT_IPFS_ENDPOINT"
        ask_and_save IPFS_GATEWAY_URL "Enter the IPFS Gateway URL" "$DEFAULT_IPFS_GATEWAY_URL"
        ask_and_save IPFS_BASIC_AUTH_USER "Enter the IPFS Basic Auth User" "$DEFAULT_IPFS_BASIC_AUTH_USER"
        ask_and_save IPFS_BASIC_AUTH_SECRET "Enter the IPFS Basic Auth Secret" "$DEFAULT_IPFS_BASIC_AUTH_SECRET"
        ask_and_save IPFS_UA_GATEWAY_URL "Enter the browser-resolveable IPFS UA Gateway URL" "$DEFAULT_IPFS_UA_GATEWAY_URL"
    else
    # Add the IPFS settings to the .env-saved file so defaults work with local testing
        cat >> ${ENV_FILE} << EOI
IPFS_VOLUME="${DEFAULT_IPFS_VOLUME}"
IPFS_ENDPOINT="${DEFAULT_IPFS_ENDPOINT}"
IPFS_GATEWAY_URL="${DEFAULT_IPFS_GATEWAY_URL}"
IPFS_BASIC_AUTH_USER="${DEFAULT_IPFS_BASIC_AUTH_USER}"
IPFS_BASIC_AUTH_SECRET="${DEFAULT_IPFS_BASIC_AUTH_SECRET}"
IPFS_UA_GATEWAY_URL="${DEFAULT_IPFS_UA_GATEWAY_URL}"
EOI
    fi

    # When testing with gateway services it may be useful to use docker containers that have been built locally
    # Setting `DEV_CONTAINERS` to `true` will use the local docker containers
    echo "DEV_CONTAINERS=\"false\"" >> ${ENV_FILE}

    # Edit `CONTENT_DB_VOLUME` to change the location of the content database, the default is a docker volume
    echo "CONTENT_DB_VOLUME=\"$DEFAULT_CONTENT_DB_VOLUME\"" >> ${ENV_FILE}
fi
set -a; source ${ENV_FILE}; set +a

if [[ ! $TESTNET_ENV =~ ^[Yy]$ ]]
then
    # Start specific services in detached mode
    echo -e "\nStarting local frequency services..."
    docker compose up -d frequency

    # Wait for 15 seconds
    echo "Waiting 15 seconds for Frequency to be ready..."
    sleep 15

    # Run npm run local:init
    echo "Running npm run local:init to provision Provider with capacity, etc..."
    cd backend && npm run local:init && cd ..
fi

if [[ $DEV_CONTAINERS == "true" ]]
then
    # Start specific services in detached mode
    echo -e "\nStarting services with local docker containers... [DEV_CONTAINERS==true]"
    docker compose -f docker-compose.yaml -f docker-compose-local.yaml --profile backend --profile frontend up -d
else
    # Start all services in detached mode
    echo -e "\nStarting all services..."
    docker compose -f docker-compose.yaml --profile backend --profile frontend up -d
fi

cat << EOI

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🚀 You can access the Social App Template at http://localhost:${SERVICE_PORT_10} 🚀                       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
EOI
