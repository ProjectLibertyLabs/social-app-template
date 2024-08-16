#!/bin/bash
# Script to start all SAT services on the Frequency Paseo Testnet

ENV_FILE=.env-saved
COMPOSE_PROJECT_NAME=gateway

# Function to ask for input with a default value and write to ${ENV_FILE}
ask_and_save() {
    local var_name=${1}
    local prompt=${2}
    local default_value=${3}
    local value=
    if [ -z "${default_value}" ]
    then
        input=
        while [ -z "${input}" ]
        do
            read -rp $'\n'"${prompt}: " input
        done
        value=${input}
    else
        read -rp $'\n'"${prompt} [${default_value}]: " input
        value=${input:-$default_value}
    fi
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
    read -p "Do you want to start on Frequency Paseo Testnet [y/N]: "
    [[ "${REPLY}" =~ ^[Yy]$ ]] && TESTNET_ENV=true || TESTNET_ENV=false
    echo "TESTNET_ENV=$TESTNET_ENV" >> ${ENV_FILE}

    if [ $TESTNET_ENV = true ]
    then
    cat << EOI

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Setting defaults for testnet...                                                             ┃
┃ Hit <ENTER> to accept the default value or enter new value and then hit <ENTER>             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

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
┃ The default configuration runs a local, containerized IPFS node.                            ┃
┃ This configuration will likely have trouble propagating content to the global IPFS          ┃
┃ network.                                                                                    ┃
┃                                                                                             ┃
┃ If you want to test between multiple instances of Gateway operating on a public blockchain  ┃
┃ (ie, Testnet or Mainnet), it is recommended to use an external IPFS pinning service.        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

EOI
    EXTERNAL_IPFS=0
    read -p "Do you want to configure an external IPFS service [y/N]? " CHANGE_IPFS_SETTINGS

    if [[ $CHANGE_IPFS_SETTINGS =~ ^[Yy]$ ]]
    then
        EXTERNAL_IPFS=1
        ask_and_save IPFS_ENDPOINT "Enter the IPFS Endpoint" "$DEFAULT_IPFS_ENDPOINT"
        ask_and_save IPFS_GATEWAY_URL "Enter the IPFS Gateway URL" "$DEFAULT_IPFS_GATEWAY_URL"
        ask_and_save IPFS_BASIC_AUTH_USER "Enter the IPFS Basic Auth User" "$DEFAULT_IPFS_BASIC_AUTH_USER"
        ask_and_save IPFS_BASIC_AUTH_SECRET "Enter the IPFS Basic Auth Secret" "$DEFAULT_IPFS_BASIC_AUTH_SECRET"
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

cat << EOI

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🚀 You can access the Social App Template at http://localhost:${FRONTEND_PORT} 🚀                       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
EOI
