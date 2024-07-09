#!/bin/bash

# Stop and remove containers, networks
echo "Stopping and removing containers, networks..."
docker compose -f docker-compose-testnet.yaml --profile full down

# Remove specified volumes to remove all state and start fresh
echo "Removing specified volumes..."
docker volume rm backend_redis_data
docker volume rm backend_chainstorage
docker volume rm backend_ipfs_data
docker volume rm backend_node_cache

# Ask for Provider ID and Provider Seed Phrase
read -p "Enter Provider ID: " PROVIDER_ID
read -p "Enter Provider Seed Phrase: " PROVIDER_ACCOUNT_SEED_PHRASE

# Export the variables
export PROVIDER_ID
export PROVIDER_ACCOUNT_SEED_PHRASE

# Start all services in detached mode
echo "Starting all services..."
docker compose -f docker-compose-testnet.yaml --profile full up -d
