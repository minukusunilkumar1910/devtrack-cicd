#!/usr/bin/env bash
set -euo pipefail
docker compose up -d --build --remove-orphans
docker image prune -f
curl --fail http://localhost/api/health
echo "DevTrack deployed successfully."
