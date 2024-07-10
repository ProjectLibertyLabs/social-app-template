#!/bin/bash
# Script to start all SAT services on the Frequency Paseo Testnet

# Ask for the Frequency Testnet RPC URL
echo "Enter the Frequency Testnet RPC URL [wss://0.rpc.testnet.amplica.io]: "
read FREQUENCY_URL
export FREQUENCY_URL=${FREQUENCY_URL:-wss://0.rpc.testnet.amplica.io}

# Ask for the Frequency HTTP Testnet RPC URL
echo "Enter the Frequency HTTP Testnet RPC URL [https://0.rpc.testnet.amplica.io]: "
read FREQUENCY_HTTP_URL
export FREQUENCY_HTTP_URL=${FREQUENCY_HTTP_URL:-https://0.rpc.testnet.amplica.io}

# Ask for Provider ID
echo "Enter Provider ID [729]: "
read PROVIDER_ID
export PROVIDER_ID=${PROVIDER_ID:-729}

# Ask for Provider Seed Phrase
echo "Enter Provider Seed Phrase [DEFAULT seed phrase needed]: "
read PROVIDER_ACCOUNT_SEED_PHRASE
export PROVIDER_ACCOUNT_SEED_PHRASE=${PROVIDER_ACCOUNT_SEED_PHRASE:-//Alice}

# Ask for the IPFS volume
echo "Enter the IPFS volume [/data/ipfs]: "
read IPFS_VOLUME
export IPFS_VOLUME=${IPFS_VOLUME:-/data/ipfs}

# Start all services in detached mode
echo "Starting all services..."
docker compose -f docker-compose-testnet.yaml --profile full up -d
