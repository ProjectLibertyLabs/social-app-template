#!/bin/bash

# Function to download a file from a GitHub repository
download_oopenapi_specs() {
    local REPO_OWNER=$1
    local REPO_NAME=$2
    local BRANCH=$3
    local FILE_PATH=$4
    local OUTPUT_FILE=$5

    # Construct the URL
    local URL="https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${FILE_PATH}"

    # Fetch the swagger.json file
    curl -o "$OUTPUT_FILE" "$URL"

    # Check if the file was downloaded successfully
    if [ $? -eq 0 ]; then
    echo "${OUTPUT_FILE} downloaded successfully."
    else
    echo "Failed to download ${OUTPUT_FILE}."
    fi
}

cd openapi-specs

# Download the swagger.json files from the microservices repositories
download_oopenapi_specs "AmplicaLabs" "account-service" "main" "swagger.json" "account-service.json"
download_oopenapi_specs "AmplicaLabs" "content-watcher-service" "main" "content-announcement.openapi.json" "content-announcement.openapi.json"
download_oopenapi_specs "AmplicaLabs" "content-publishing-service" "main" "swagger.json" "content-publishing-service.json"
download_oopenapi_specs "AmplicaLabs" "content-watcher-service" "main" "swagger.json" "content-watcher-service.json"
download_oopenapi_specs "AmplicaLabs" "graph-service" "main" "swagger.json" "graph-service.json"
