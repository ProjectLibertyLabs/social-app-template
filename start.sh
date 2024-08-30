#!/bin/bash
# Script to start all SAT services on the Frequency Paseo Testnet

. ./bash_functions.sh

SKIP_CHAIN_SETUP=false

###################################################################################
# show_help
#
# Description: Simple function to display the correct usage & options of this script
#
###################################################################################
function show_help() {
    echo "Usage: ./start.sh [options]"
    echo "Options:"
    echo "  -h, --help                 Show this help message and exit"
    echo "  -n, --name                 Specify the project name"
    echo "  -s, --skip-setup           Skip running chain scenario setup (provider, capacity, etc)"
}

###################################################################################
# Parse command-line arguments
###################################################################################
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -h|--help) show_help; exit 0 ;;
        -n|--name) BASE_NAME="$2"; shift ;;
        -s|--skip-setup) SKIP_CHAIN_SETUP=true ;;
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

####### Check for Docker and Docker Compose
if ! command -v docker &> /dev/null || ! command -v docker compose &> /dev/null; then
    printf "Docker and Docker Compose are required but not installed. Please install them and try again.\n"
    exit 1
fi

####### Check for existing ENV_FILE and ask user if they want to re-use it
if [ -f ${ENV_FILE} ]; then
    echo -e "Found saved environment from a previous run:\n"
    redacted_content=$(redact_sensitive_values "${ENV_FILE}")
    echo "${redacted_content}"

    if yesno "Do you want to re-use the saved parameters" Y
    then
        ${OUTPUT} "Loading environment values from file..."
    else
        clear
        ${OUTPUT} "Removing previous saved environment..."

        rm ${ENV_FILE}
        # If the file fails to delete, exit the script
        if [ -f ${ENV_FILE} ]
        then
            ${OUTPUT} "Failed to remove previous saved environment. Exiting..."
        fi
    fi
fi

######
###### If no existing ENV_FILE, run through all prompts
######
if [ ! -f ${ENV_FILE} ]
then
    ${OUTPUT} << EOI
Creating project environment file:
    ${ENV_FILE}
EOI
    # Setup some variables for easy port management
    read -p "Enter starting port for local port mapping (reserves a 20-port range) [3000]: " portno
    FRONTEND_PORT=${portno:-3000}
    export_save_variable FRONTEND_PORT ${FRONTEND_PORT}
    STARTING_PORT=$(( FRONTEND_PORT + 10 ))
    for i in {0..10}
    do
        export_save_variable SERVICE_PORT_${i} $(( STARTING_PORT + i ))
    done

    export_save_variable COMPOSE_PROJECT_NAME ${COMPOSE_PROJECT_NAME}
    echo
    read -p "Enter a tag to use to pull the Gateway Docker images [latest]: " tag
    export_save_variable DOCKER_TAG ${tag:-latest}

    # Ask the user if they want to start on testnet or local
    if yesno "Do you want to start on Frequency Paseo Testnet" N; then
        TESTNET_ENV=true
        PROFILES="${PROFILES} local-node"
    else
        TESTNET_ENV=false
        COMPOSE_FILES="${COMPOSE_FILES} docker-compose.local-frequency.yaml"
    fi
    export_save_variable TESTNET_ENV ${TESTNET_ENV}

    # Ask the user which services they want to start
    ${OUTPUT} << EOI
Select the services you want to start.

If you only want to start selected services, enter 'n' to exclude the service.
Note: frontend and backend require all the gateway services to be running.

Hit <ENTER> to accept the default value or enter new value and then hit <ENTER>
EOI
    # If the user has selected to start the frontend or the backend, then automatically start the rest of the services
    if yesno "Start the frontend service" Y ; then
        PROFILES=${ALL_PROFILES}
    elif yesno "Start the backend service" Y ; then
        PROFILES=${BACKEND_ONLY_PROFILES}
    else
        if yesno "Start the account service" Y ; then
            PROFILES="${PROFILES} account"
        fi
        if yesno "Start the graph service" Y ; then
            PROFILES="${PROFILES} graph"
        fi
        if yesno "Start the content-publishing service" Y ; then
            PROFILES="${PROFILES} content_publishing"
        fi
        if yesno "Start the content-watcher service" Y ; then
            PROFILES="${PROFILES} content_watcher"
        fi
    fi

    if [ ${TESTNET_ENV} != true ]; then
        PROFILES="${PROFILES} local-node"
    fi

    # Save the PROFILES variable to the .env file
    export_save_variable "PROFILES" "${PROFILES}"

    ${OUTPUT} << EOI
Selected services to start:
${PROFILES}
EOI

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

    # If the user has selected not to start the frontend then don't ask for the title or header color
    if [[ "${PROFILES}" =~ frontend ]]
    then
        # Allow different instances to have different banner titles
        ask_and_save REACT_APP_TITLE "Enter the title of the application" "Social Web Demo"

        # Allow different instances to have different background colors in the header
        echo
        ${OUTPUT} << EOI
Select the background color of the header:
EOI
        selected_color_hex=$(select_color)
        export_save_variable REACT_APP_HEADER_BG_COLOR "${selected_color_hex}"
    else
        export_save_variable REACT_APP_TITLE "Social Web Demo"
        export_save_variable REACT_APP_HEADER_BG_COLOR "#FFFFFF"
    fi

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
        export_save_variable PROVIDER_ID 1
        export_save_variable PROVIDER_ACCOUNT_SEED_PHRASE //Alice
    fi
    ${OUTPUT} << EOI
The default configuration runs a local, containerized IPFS node.
This configuration will likely have trouble propagating content to the global IPFS
network.

If you want to test between multiple instances of Gateway operating on a public blockchain
(ie, Testnet or Mainnet), it is recommended to use an external IPFS pinning service.

EOI
    if yesno "Do you want to configure an external IPFS service" N
    then
        ask_and_save IPFS_ENDPOINT "Enter the IPFS Endpoint" "$DEFAULT_IPFS_ENDPOINT"
        ask_and_save IPFS_GATEWAY_URL "Enter the IPFS Gateway URL" "$DEFAULT_IPFS_GATEWAY_URL"
        ask_and_save IPFS_BASIC_AUTH_USER "Enter the IPFS Basic Auth User" "$DEFAULT_IPFS_BASIC_AUTH_USER" true
        ask_and_save IPFS_BASIC_AUTH_SECRET "Enter the IPFS Basic Auth Secret" "$DEFAULT_IPFS_BASIC_AUTH_SECRET" true
        ask_and_save IPFS_UA_GATEWAY_URL "Enter the browser-resolveable IPFS UA Gateway URL" "$DEFAULT_IPFS_UA_GATEWAY_URL"
    else
        COMPOSE_FILES="${COMPOSE_FILES} docker-compose.local-ipfs.yaml"
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

    # When testing with gateway services it may be useful to use docker containers that have been built locally
    # Setting `DEV_CONTAINERS` to `true` will use the local docker containers
    export_save_variable DEV_CONTAINERS false

    # Edit `CONTENT_DB_VOLUME` to change the location of the content database, the default is a docker volume
    export_save_variable CONTENT_DB_VOLUME ${DEFAULT_CONTENT_DB_VOLUME}

    export_save_variable COMPOSE_FILES ${COMPOSE_FILES}
fi

###################################################################################
# Finished with prompting (or skipped).
#
# Now read the resulting ENV_FILE and launch the services
###################################################################################

set -a; source ${ENV_FILE}; set +a

if [ $DEV_CONTAINERS = true ]
then
    COMPOSE_FILES="${COMPOSE_FILES} docker-compose.dev-images.yaml"
    # Start specific services in detached mode
    echo -e "\nStarting selected services with local docker containers... [DEV_CONTAINERS==true]"
else
    # Start all services in detached mode
    echo -e "\nStarting selected services..."
fi

COMPOSE_CMD=$( prefix_postfix_values "${COMPOSE_FILES}" "-f ")
PROFILE_CMD=$( prefix_postfix_values "${PROFILES}" "--profile ")

docker compose ${COMPOSE_CMD} ${PROFILE_CMD} up -d

if [ ${SKIP_CHAIN_SETUP} != true -a ${TESTNET_ENV} != true ]
then
    # Run npm run local:init
    echo "Running npm run local:init to provision Provider with capacity, etc..."
    ( cd backend && npm run local:init )
fi

if [[ ${PROFILES} =~ frontend ]]
then
${OUTPUT} << EOI
🚀 You can access the Social App Template frontend at http://localhost:${FRONTEND_PORT} 🚀
EOI
fi

SERVICES_STR="\
The selected services are running.

🚀 You can access the Gateway at the following local addresses: 🚀
"
if [[ ${PROFILES} =~ account ]]; then
SERVICES_STR="${SERVICES_STR}
      * account-service:
        - API:              http://localhost:${SERVICE_PORT_3}
        - Queue management: http://localhost:${SERVICE_PORT_3}/queues
        - Swagger UI:       http://localhost:${SERVICE_PORT_3}/docs/swagger
"
fi
if [[ ${PROFILES} =~ content_publishing ]]; then
SERVICES_STR="${SERVICES_STR}
      * content-publishing-service
        - API:              http://localhost:${SERVICE_PORT_0}
        - Queue management: http://localhost:${SERVICE_PORT_0}/queues
        - Swagger UI:       http://localhost:${SERVICE_PORT_0}/docs/swagger
"
fi
if [[ ${PROFILES} =~ content_watcher ]]; then
SERVICES_STR="${SERVICES_STR}
      * content-watcher-service
        - API:              http://localhost:${SERVICE_PORT_1}
        - Queue management: http://localhost:${SERVICE_PORT_1}/queues
        - Swagger UI:       http://localhost:${SERVICE_PORT_1}/docs/swagger
"
fi
if [[ ${PROFILES} =~ graph ]]; then
SERVICES_STR="${SERVICES_STR}
      * graph-service
        - API:              http://localhost:${SERVICE_PORT_2}
        - Queue management: http://localhost:${SERVICE_PORT_2}/queues
        - Swagger UI:       http://localhost:${SERVICE_PORT_2}/docs/swagger
"
fi
if [[ ${PROFILES} =~ backend ]]; then
SERVICES_STR="${SERVICES_STR}
      * backend
        - API:              http://localhost:${SERVICE_PORT_8}/docs/swagger
        - Swagger UI:       http://localhost:${SERVICE_PORT_8}/docs/swagger
"
fi

${OUTPUT} "${SERVICES_STR}"
