#!/usr/bin/env bash
# User-friendly startup for MediCare Plus backend (Docker)
set -euo pipefail

cd "$(dirname "$0")"

API_URL="${API_PUBLIC_URL:-http://localhost:8001}"
HEALTH_URL="${API_URL}/health"
MAX_WAIT="${STARTUP_TIMEOUT:-90}"
FOLLOW_LOGS="${FOLLOW_LOGS:-0}"

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
DIM='\033[0;2m'
NC='\033[0m'

step() { echo -e "${BLUE}▸${NC} $1"; }
ok()   { echo -e "${GREEN}✔${NC} $1"; }
fail() { echo -e "${RED}✖${NC} $1"; }

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  MediCare Plus — Backend Startup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

step "Building Docker images..."
BUILD_LOG="$(mktemp)"
trap 'rm -f "$BUILD_LOG"' EXIT
if docker compose build >"$BUILD_LOG" 2>&1; then
  ok "Docker build successful"
else
  fail "Docker build failed"
  echo ""
  tail -20 "$BUILD_LOG"
  exit 1
fi

USE_LOCAL_MONGO=1
if [ -f .env ] && grep -q 'MONGODB_URL=.*mongodb+srv' .env; then
  USE_LOCAL_MONGO=0
fi

if [ "$USE_LOCAL_MONGO" -eq 1 ]; then
  step "Starting local MongoDB + API (from .env)..."
  COMPOSE_CMD=(docker compose --profile local up -d)
  MONGO_LABEL="localhost:27018 (Docker)"
else
  step "Starting API with MongoDB Atlas (from .env)..."
  COMPOSE_CMD=(docker compose up -d api)
  MONGO_LABEL="MongoDB Atlas (see .env MONGODB_URL)"
fi

if "${COMPOSE_CMD[@]}"; then
  ok "Containers started"
else
  fail "Failed to start containers"
  exit 1
fi

if [ "$USE_LOCAL_MONGO" -eq 1 ]; then
  step "Waiting for MongoDB..."
  elapsed=0
  mongo_ok=0
  while [ "$elapsed" -lt "$MAX_WAIT" ]; do
    if docker compose --profile local exec -T mongo mongosh --quiet --eval "db.adminCommand('ping').ok" 2>/dev/null | grep -q 1; then
      mongo_ok=1
      break
    fi
    sleep 2
    elapsed=$((elapsed + 2))
  done

  if [ "$mongo_ok" -eq 1 ]; then
    ok "MongoDB connected"
  else
    fail "MongoDB not connected (timed out after ${MAX_WAIT}s)"
    echo ""
    echo -e "${DIM}Recent MongoDB logs:${NC}"
    docker compose --profile local logs mongo --tail 15
    exit 1
  fi
else
  ok "Using MongoDB Atlas (database created on first seed write)"
fi

step "Waiting for API (Uvicorn)..."
elapsed=0
api_ok=0
while [ "$elapsed" -lt "$MAX_WAIT" ]; do
  if curl -sf "$HEALTH_URL" >/dev/null 2>&1; then
    api_ok=1
    break
  fi
  sleep 2
  elapsed=$((elapsed + 2))
done

if [ "$api_ok" -eq 1 ]; then
  ok "API started"
  ok "Uvicorn running on ${API_URL}"
else
  fail "API not responding — Uvicorn may not have started"
  echo ""
  echo -e "${DIM}Recent API logs:${NC}"
  docker compose logs api --tail 25
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ok "All services running successfully"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  API:     ${API_URL}"
echo "  Docs:    ${API_URL}/docs"
echo "  Health:  ${HEALTH_URL}"
echo "  MongoDB: ${MONGO_LABEL}"
echo ""
echo "  Demo:    patient@demo.com / demo123"
echo ""
echo -e "${DIM}  Stop:  docker compose down${NC}"
echo -e "${DIM}  Logs:  docker compose logs -f api${NC}"
echo ""

if [ "$FOLLOW_LOGS" = "1" ]; then
  step "Following API logs (Ctrl+C to stop)..."
  docker compose logs -f api
fi
