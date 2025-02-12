#!/bin/bash

source ./config.sh

set -e

echo "Pulling Docker image '${FULL_IMAGE_NAME}'..."
docker pull "${FULL_IMAGE_NAME}"

echo "Running Docker container from image '${FULL_IMAGE_NAME}'..."
docker run -d --name "${IMAGE_NAME}" -p 8000:8000 "${FULL_IMAGE_NAME}"
