#!/bin/bash
# Script to start all SAT services on the Frequency Paseo Testnet

# Function to ask for input with a default value and write to .env-testnet
ask_and_save() {
    local var_name=$1
    local prompt=$2
    local default_value=$3
    printf "\n%s [%s]: " "$prompt" "$default_value"
    read -r input
    local value=${input:-$default_value}
    echo "export $var_name=\"$value\"" >> .env-testnet
}

# Check for Docker and Docker Compose
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    printf "Docker and Docker Compose are required but not installed. Please install them and try again.\n"
    exit 1
fi

# Load existing .env-testnet file if it exists
if [ -f .env-testnet ]; then
    echo -e "****************************************************************************************"
    echo -e "* Loading existing .env-testnet file environment values...                             *"
    echo -e "****************************************************************************************\n"
    set -a; source .env-testnet; set +a
else 
    # Create .env-testnet file to store environment variables
    echo -e "****************************************************************************************"
    echo -e "* Creating .env-testnet file to store environment variables...                         *"
    echo -e "****************************************************************************************"
    > .env-testnet

    ask_and_save "FREQUENCY_URL" "Enter the Frequency Testnet RPC URL" "wss://0.rpc.testnet.amplica.io"
    ask_and_save "FREQUENCY_HTTP_URL" "Enter the Frequency HTTP Testnet RPC URL" "https://0.rpc.testnet.amplica.io"
    echo -e "\n*************************************************************************************************"
    echo -e   "* A Provider is required to start the services.                                                 *"
    echo -e   "* If you need to become a provider, visit https://provider.frequency.xyz/ to get a Provider ID. *"
    echo -e   "*************************************************************************************************"
    ask_and_save "PROVIDER_ID" "Enter Provider ID" "729"
    ask_and_save "PROVIDER_ACCOUNT_SEED_PHRASE" "Enter Provider Seed Phrase" "DEFAULT seed phrase needed"
    ask_and_save "IPFS_VOLUME" "Enter the IPFS volume" "/data/ipfs"
    set -a; source .env-testnet; set +a
fi

# Start all services in detached mode
echo -e "\nStarting all services..."
docker compose -f docker-compose-testnet.yaml --profile full up -d
