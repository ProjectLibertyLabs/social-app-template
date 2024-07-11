#!/bin/bash
# Script to start all SAT services with a local Frequency node

# Function to ask for input with a default value and write to .env-dev
ask_and_save() {
    local var_name=$1
    local prompt=$2
    local default_value=$3
    read -rp $'\n'"${prompt} [${default_value}]: " input
    local value=${input:-$default_value}
    echo "export $var_name=\"$value\"" >> .env-dev
}

# Check for Docker and Docker Compose
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    printf "Docker and Docker Compose are required but not installed. Please install them and try again.\n"
    exit 1
fi

# Load existing .env-dev file if it exists
if [ -f .env-dev ]; then
    cat << EOI
****************************************************************************************
* Loading existing .env-dev file environment values...                                 *
****************************************************************************************
EOI
else 
    # Create .env-dev file to store environment variables
    cat << EOI
****************************************************************************************
* Creating .env-dev file to store environment variables...                             *
****************************************************************************************
EOI
    touch .env-dev
    ask_and_save "FREQUENCY_URL" "Enter the Frequency Testnet RPC URL" "ws://frequency:9944"
    ask_and_save "FREQUENCY_HTTP_URL" "Enter the Frequency HTTP Testnet RPC URL" "http://localhost:9944"
    cat << EOI
*************************************************************************************************
* A Provider is required to start the services.                                                 *
* If you need to become a provider, visit https://provider.frequency.xyz/ to get a Provider ID. *
*************************************************************************************************
EOI
    ask_and_save "PROVIDER_ID" "Enter Provider ID" "1"
    ask_and_save "PROVIDER_ACCOUNT_SEED_PHRASE" "Enter Provider Seed Phrase" "//Alice"
    ask_and_save "IPFS_VOLUME" "Enter the IPFS volume" "/data/ipfs"
fi
set -a; source .env-dev;

# Start specific services in detached mode
echo "Starting frequency services..."
docker compose up -d frequency

# Wait for 15 seconds
echo "Waiting 15 seconds for Frequency to be ready..."
sleep 15

# Run npm run local:init 
echo "Running npm run local:init to provision Provider with capacity, etc..."
cd backend && npm run local:init && cd -

# Start all services in detached mode
echo -e "\nStarting all services..."
docker compose --profile backend --profile frontend up -d
