#!/bin/bash

# Stop and remove containers, networks
echo "Stopping and removing containers, networks..."
docker compose --profile full down

# Remove specified volumes
echo "Removing specified volumes..."
docker volume rm backend_redis_data
docker volume rm backend_chainstorage
docker volume rm backend_ipfs_data
docker volume rm backend_node_cache

# Remove all images
echo "Removing all images..."
docker rmi social-app-backend
docker rmi projectlibertylabs/account-service
docker rmi projectlibertylabs/content-watcher-service
docker rmi projectlibertylabs/graph-service
docker rmi projectlibertylabs/content-publishing-service
