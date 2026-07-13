#!/usr/bin/env bash
# Prints the published host port for an existing Docker container port mapping;
# otherwise prints the first free TCP port on localhost from <base_port>.
set -euo pipefail

container_name="${1:?usage: resolve-docker-port.sh <container_name> <container_port> <base_port> [max_tries]}"
container_port="${2:?usage: resolve-docker-port.sh <container_name> <container_port> <base_port> [max_tries]}"
base_port="${3:?usage: resolve-docker-port.sh <container_name> <container_port> <base_port> [max_tries]}"
max_tries="${4:-50}"

published="$({ docker port "$container_name" "$container_port" || true; } 2>/dev/null | head -n 1)"
if [[ -n "$published" ]]; then
  published="${published##*:}"
  if [[ "$published" =~ ^[0-9]+$ ]]; then
    echo "$published"
    exit 0
  fi
fi

bash scripts/find-free-port.sh "$base_port" "$max_tries"
