#!/bin/bash
# Simple post-deploy smoke test to catch failed boots early
set -euo pipefail

APP_PORT="${PORT:-5000}"
HEALTH_URL="http://127.0.0.1:${APP_PORT}/api/health"

echo "Waiting for app to boot on port ${APP_PORT}..."

for attempt in {1..5}; do
  if curl -fsS --max-time 5 "${HEALTH_URL}" >/dev/null; then
    echo "Health check OK on attempt ${attempt}"
    exit 0
  fi
  echo "Health check failed (attempt ${attempt}/5), retrying in 5s..."
  sleep 5
done

echo "Health check failed after retries, aborting deployment"
exit 1
