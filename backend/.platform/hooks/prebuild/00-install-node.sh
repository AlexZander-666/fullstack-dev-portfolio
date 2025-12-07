#!/bin/bash
# Ensure the instance uses the desired Node.js version before building
set -euo pipefail

# Default to Node 20.x / npm 10.x; override via NODE_VERSION env if needed
NODE_VERSION="${NODE_VERSION:-20.17.0}"

echo "Using Node.js ${NODE_VERSION} on Elastic Beanstalk..."

if ! command -v n >/dev/null 2>&1; then
  echo "Installing 'n' version manager..."
  npm install -g n
fi

n "${NODE_VERSION}"

echo "Node version now: $(node -v), npm: $(npm -v)"
