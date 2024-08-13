#!/bin/bash
# Script to start all SAT services on the Frequency Paseo Testnet

# Function to ask for input with a default value and write to .env-saved
ask_and_save() {
    local var_name=${1}
    local prompt=${2}
    local default_value=${3}
    read -rp $'\n'"${prompt} [${default_value}]: " input
    local value=${input:-$default_value}
    echo "${var_name}=\"${value}\"" >> .env-saved
}

# Check for Docker and Docker Compose
if ! command -v docker &> /dev/null || ! command -v docker compose &> /dev/null; then
    printf "Docker and Docker Compose are required but not installed. Please install them and try again.\n"
    exit 1
fi

# Load existing .env-saved file if it exists
if [ -f .env-saved ]; then
    echo -e "Found saved environment from a previous run:\n"
    cat .env-saved
    echo
    read -p  "Do you want to re-use the saved parameters? [Y/n]: " REUSE_SAVED
    REUSE_SAVED=${REUSE_SAVED:-y}

    if [[ ${REUSE_SAVED} =~ ^[Yy] ]]
    then
        cat << EOI
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Loading existing .env-saved file environment values...                                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
EOI
    else
        cat << EOI
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Removing previous saved environment...                                                      |
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
EOI
    rm .env-saved
    fi
fi

if [ ! -f .env-saved ]
then
    # Setup some variables for easy port management
    STARTING_PORT=3010
    for i in {0..10}
    do
    eval SERVICE_PORT_${i}=$(( STARTING_PORT + i ))
    eval "export SERVICE_PORT_${i}=\${SERVICE_PORT_${i}}"
    eval "echo SERVICE_PORT_${i}=\${SERVICE_PORT_${i}}" >> .env-saved
    done

    # Create .env-saved file to store environment variables
    cat << EOI
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Creating .env-saved file to store environment variables...                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

EOI
    echo "COMPOSE_PROJECT_NAME='gateway'" >> .env-saved
    read -p "Enter a tag to use to pull the Gateway Docker images [latest]: " tag
    echo "DOCKER_TAG=${tag:-latest}" >> .env-saved
    # Ask the user if they want to start on testnet or local
    echo "Do you want to start on Frequency Paseo Testnet [y/n]:"
    read TESTNET_ENV
    echo "TESTNET_ENV=\"$TESTNET_ENV\"" >> .env-saved

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
        DEFAULT_PROVIDER_ID="729"
        DEFAULT_PROVIDER_ACCOUNT_SEED_PHRASE="DEFAULT seed phrase needed"
        DEFAULT_IPFS_ENDPOINT="https://ipfs.infura.io:5001"
    else
        echo -e "\nStarting on local..."
        DEFAULT_TESTNET_ENV="local"
        DEFAULT_FREQUENCY_URL="ws://frequency:9944"
        DEFAULT_FREQUENCY_HTTP_URL="http://localhost:9944"
        DEFAULT_PROVIDER_ID="1"
        DEFAULT_PROVIDER_ACCOUNT_SEED_PHRASE="//Alice"
    fi
    DEFAULT_IPFS_VOLUME="/data/ipfs"
    DEFAULT_IPFS_ENDPOINT="http://ipfs:5001"
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
┃ Do you want to change the IPFS settings [y/n]:                                              ┃
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
        ask_and_save IPFS_UA_GATEWAY_URL "Enter the browser-resolveable IPFS Gateway URL" "$DEFAULT_IPFS_UA_GATEWAY_URL"
    else
    # Add the IPFS settings to the .env-saved file
    echo "IPFS_VOLUME=\"$DEFAULT_IPFS_VOLUME\"" >> .env-saved
    echo "IPFS_ENDPOINT=\"$DEFAULT_IPFS_ENDPOINT\"" >> .env-saved
    echo "IPFS_GATEWAY_URL=\"$DEFAULT_IPFS_GATEWAY_URL\"" >> .env-saved
    echo "IPFS_BASIC_AUTH_USER=\"$DEFAULT_IPFS_BASIC_AUTH_USER\"" >> .env-saved
    echo "IPFS_BASIC_AUTH_SECRET=\"$DEFAULT_IPFS_BASIC_AUTH_SECRET\"" >> .env-saved
    echo "IPFS_UA_GATEWAY_URL=\"$DEFAULT_IPFS_UA_GATEWAY_URL\"" >> .env-saved
    fi

    # When testing with gateway services it may be useful to use docker containers that have been built locally
    # Setting `DEV_CONTAINERS` to `true` will use the local docker containers
    echo "DEV_CONTAINERS=\"false\"" >> .env-saved

    ask_and_save "CONTENT_DB_VOLUME" "Enter the location of the Content DB" "${DEFAULT_CONTENT_DB_VOLUME}"
fi
set -a; source .env-saved; set +a

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

echo "DEV_CONTAINERS:$DEV_CONTAINERS"
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
┃ 🚀 You can access the Gateway at http://localhost:3000/ 🚀                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
EOI
