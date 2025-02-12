#!/bin/bash

# Make sure to log in to Docker Hub before running this script.
# docker login

source ./config.sh

set -e
set -o pipefail

DOCKERFILE_PATH="../Dockerfile"
REQUIREMENTS_PATH="../requirements.txt"

echo "Exporting requirements.txt from Poetry..."
poetry export --without-hashes --only main -o "${REQUIREMENTS_PATH}"

echo "Building Docker image..."
docker build -t "${FULL_IMAGE_NAME}" -f "${DOCKERFILE_PATH}" ../

echo "Docker image '${IMAGE_NAME}:${TAG}' built successfully."

echo "Pushing the Docker image to Docker Hub..."
docker push "${FULL_IMAGE_NAME}"
