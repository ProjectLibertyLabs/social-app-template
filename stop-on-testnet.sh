#!/bin/bash
# Stop all services and optionally remove specified volumes to remove all state and start fresh

# Export the variables that are used in the docker-compose-testnet.yaml file
if [ -f .env-testnet ]; then
    set -a; source .env-testnet; set +a
fi

# Shutting down any running services
echo "Shutting down any running services..."
docker compose -f docker-compose-testnet.yaml --profile full down

# Ask the user if they want to remove specified volumes
echo "Do you want to remove specified volumes to remove all state and start fresh? [y/n]: "
read REMOVE_VOLUMES

if [[ $REMOVE_VOLUMES =~ ^[Yy]$ ]]
then
    echo "Removing specified volumes..."
    # Docker volume names are lowercase versions of the directory name
    # In the root directory of the repository, we get from the system directory name
    docker volume rm $(basename "$(pwd)" | tr '[:upper:]' '[:lower:]')_redis_data
    docker volume rm $(basename "$(pwd)" | tr '[:upper:]' '[:lower:]')_ipfs_data
    docker volume rm $(basename "$(pwd)" | tr '[:upper:]' '[:lower:]')_backend_node_cache
    docker volume rm $(basename "$(pwd)" | tr '[:upper:]' '[:lower:]')_frontend_node_cache
else
    echo "Not removing specified volumes..."
fi
