#!/bin/bash
# Stop all services and optionally remove specified volumes to remove all state and start fresh

# Export the variables that are used in the docker-compose-testnet.yaml file
# The values are not used for shutdown, but cause error messages if missing
export FREQUENCY_URL=${FREQUENCY_URL:-wss://0.rpc.testnet.amplica.io}
export FREQUENCY_HTTP_URL=${FREQUENCY_HTTP_URL:-https://0.rpc.testnet.amplica.io}
export PROVIDER_ID=${PROVIDER_ID:-729}
export PROVIDER_ACCOUNT_SEED_PHRASE=${PROVIDER_ACCOUNT_SEED_PHRASE:-//Alice}
export IPFS_VOLUME=${IPFS_VOLUME:-/data/ipfs}

# Shutting down any running services
echo "Shutting down any running services..."
docker compose -f docker-compose-testnet.yaml --profile full down

# Ask the user if they want to remove specified volumes
echo "Do you want to remove specified volumes to remove all state and start fresh? [y/n]: "
read REMOVE_VOLUMES

if [[ $REMOVE_VOLUMES =~ ^[Yy]$ ]]
then
    echo "Removing specified volumes..."
    docker volume rm backend_redis_data
    docker volume rm backend_ipfs_data
    docker volume rm backend_node_cache
else
    echo "Not removing specified volumes..."
fi
