#!/bin/sh
set -e

PUBLIC_URL="${API_PUBLIC_URL:-http://localhost:8001}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  MediCare Plus API — starting"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

printf "▸ Waiting for MongoDB... "
if python /app/scripts/wait_for_mongo.py; then
  echo "OK"
  echo "✔ MongoDB connected"
else
  echo "FAILED"
  echo ""
  echo "✖ MongoDB not connected"
  echo "  Check that the mongo service is running:"
  echo "    docker compose logs mongo"
  echo ""
  exit 1
fi

echo "▸ Starting API server..."
exec uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --log-level info
