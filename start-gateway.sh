#!/bin/bash
# Script to start all SAT services on the Frequency Paseo Testnet

# Function to ask for input with a default value and write to .env-saved
ask_and_save() {
    local var_name=$1
    local prompt=$2
    local default_value=$3
    read -rp $'\n'"${prompt} [${default_value}]: " input
    local value=${input:-$default_value}
    echo "export $var_name=\"$value\"" >> .env-saved
}

# Check for Docker and Docker Compose
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    printf "Docker and Docker Compose are required but not installed. Please install them and try again.\n"
    exit 1
fi

# Load existing .env-saved file if it exists
if [ -f .env-saved ]; then
    cat << EOI
****************************************************************************************
* Loading existing .env-saved file environment values...                             *
****************************************************************************************

EOI
else 
    # Create .env-saved file to store environment variables
    cat << EOI
****************************************************************************************
* Creating .env-saved file to store environment variables...                         *
****************************************************************************************

EOI
    touch .env-saved
    # Ask the user if they want to start on testnet or local
    echo "Do you want to start on Frequency Paseo Testnet [y/n]:"
    read TESTNET_ENV
    echo "export TESTNET_ENV=\"$TESTNET_ENV\"" >> .env-saved

    if [[ $TESTNET_ENV =~ ^[Yy]$ ]]
    then
        echo -e "\nStarting on testnet..."
        TESTNET_ENV="testnet"
        FREQUENCY_URL="wss://0.rpc.testnet.amplica.io"
        FREQUENCY_HTTP_URL="https://0.rpc.testnet.amplica.io"
        PROVIDER_ID="729"
        PROVIDER_ACCOUNT_SEED_PHRASE="DEFAULT seed phrase needed"
        IPFS_VOLUME="/data/ipfs"
    else
        echo -e "\nStarting on local..."
        TESTNET_ENV="local"
        FREQUENCY_URL="ws://frequency:9944"
        FREQUENCY_HTTP_URL="http://localhost:9944"
        PROVIDER_ID="1"
        PROVIDER_ACCOUNT_SEED_PHRASE="//Alice"
        IPFS_VOLUME="/data/ipfs"
    fi

    ask_and_save "FREQUENCY_URL" "Enter the Frequency Testnet RPC URL" "$FREQUENCY_URL"
    ask_and_save "FREQUENCY_HTTP_URL" "Enter the Frequency HTTP Testnet RPC URL" "$FREQUENCY_HTTP_URL"
    cat << EOI

*************************************************************************************************
* A Provider is required to start the services.                                                 *
* If you need to become a provider, visit https://provider.frequency.xyz/ to get a Provider ID. *
*************************************************************************************************
EOI
    ask_and_save "PROVIDER_ID" "Enter Provider ID" "$PROVIDER_ID"
    ask_and_save "PROVIDER_ACCOUNT_SEED_PHRASE" "Enter Provider Seed Phrase" "$PROVIDER_ACCOUNT_SEED_PHRASE"
    ask_and_save "IPFS_VOLUME" "Enter the IPFS volume" "$IPFS_VOLUME"
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
    cd backend && npm run local:init && cd -
fi

# Start all services in detached mode
echo -e "\nStarting all services..."
docker compose  --profile backend --profile frontend up -d
