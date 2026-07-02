# MediCare Plus — Python REST API Backend

Production-grade **FastAPI** backend for the [Next.js frontend](../healthcare-management-system-requirements-NEXT). Implements all **8 user roles** and every feature surfaced in the frontend mock data and routes.

---

## Table of contents

- [Stack](#stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Environment variables](#environment-variables)
- [How to run](#how-to-run)
  - [Option 1 — Docker + Atlas (recommended)](#option-1--docker--atlas-recommended)
  - [Option 2 — Local development (venv + uvicorn)](#option-2--local-development-venv--uvicorn)
  - [Option 3 — Production (no Docker)](#option-3--production-no-docker)
- [MongoDB Atlas setup](#mongodb-atlas-setup)
- [Demo credentials](#demo-credentials)
- [API overview](#api-overview)
- [Interactive API docs](#interactive-api-docs)
- [Project structure](#project-structure)
- [Tests](#tests)
- [Docker commands](#docker-commands)
- [Troubleshooting](#troubleshooting)
- [Frontend integration](#frontend-integration)

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | FastAPI |
| Server | Uvicorn (ASGI) |
| Language | Python 3.12 |
| Database | MongoDB Atlas (or local MongoDB) |
| ODM | Beanie + Motor (async) |
| Validation | Pydantic v2 |
| Auth | JWT (access + refresh tokens) |
| Security | bcrypt password hashing, CORS |
| Container | Docker + Docker Compose |

---

## Features

### Roles (RBAC)

`patient` · `doctor` · `admin` · `pharmacist` · `lab_tech` · `receptionist` · `nurse` · `supplier`

### Domains

- **Auth** — login, signup, refresh token, profile, logout
- **Users** — CRUD, patient directory, profile updates
- **Appointments** — book, list, update, cancel
- **Clinical** — doctors, prescriptions, medical notes, referrals, family members, insurance, health timeline, doctor availability & earnings
- **Lab** — reports, tests, catalog, samples, equipment, collection appointments
- **Pharmacy** — inventory, orders, fulfillment, purchase orders, returns, suppliers, sales analytics, expiry alerts
- **Admin** — beds, departments, billing/invoices, audit log, announcements, doctor onboarding, analytics, notifications, nurse tasks, supplier portal
- **Messages** — doctor–patient messaging threads

On first start with `SEED_DATABASE=true`, demo users and sample data are inserted automatically (skipped if data already exists).

---

## Prerequisites

- **Python 3.12+** (for local development)
- **MongoDB Atlas** account ([free tier](https://www.mongodb.com/atlas)) — recommended
- **Docker** & **Docker Compose** — optional, for containerized runs

---

## Environment variables

Copy the example file and edit:

```bash
cp .env.example .env
```

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB connection string. **Database name goes in the URL path.** | `mongodb+srv://user:pass@cluster.mongodb.net/medicare_plus?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret for signing JWTs | long random string |
| `SEED_DATABASE` | Seed demo data on startup | `true` |
| `CORS_ORIGINS` | Allowed frontend origins (comma-separated) | `http://localhost:3000` |
| `DEBUG` | Enable debug mode | `true` |

> No separate `MONGODB_DB` variable — the database name is parsed from `MONGODB_URL` (e.g. `/medicare_plus`).

---

## How to run

### Option 1 — Docker + Atlas (recommended)

Best for keeping the server running in the background. Uses your `.env` Atlas URL automatically.

```bash
cd healthcare-management-system-requirements-Python
cp .env.example .env    # add your Atlas URL
chmod +x start.sh
./start.sh
```

`start.sh` will:
1. Build the Docker image
2. Detect Atlas (`mongodb+srv` in `.env`) and start only the API container
3. Wait for the health check and print URLs

**Follow logs after startup:**

```bash
FOLLOW_LOGS=1 ./start.sh
```

**Manual Docker:**

```bash
docker compose up -d --build api    # Atlas / external MongoDB
docker compose logs -f api          # view logs
docker compose down                 # stop
```

| Endpoint | URL |
|----------|-----|
| API root | http://localhost:8001 |
| Swagger docs | http://localhost:8001/docs |
| ReDoc | http://localhost:8001/redoc |
| Health | http://localhost:8001/health |
| OpenAPI JSON | http://localhost:8001/openapi.json |

---

### Option 2 — Local development (venv + uvicorn)

Best when actively editing Python code. Uses hot reload.

> **Note:** Do not run Docker and local uvicorn at the same time — both use port **8001**.

```bash
cd healthcare-management-system-requirements-Python

# One-time setup
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # add your Atlas URL

# Stop Docker if it is using port 8001
docker compose down

# Start dev server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

**Why venv?** It isolates this project's Python packages (FastAPI, uvicorn, beanie, etc.) from your system Python. It is not required for uvicorn specifically — it is standard Python practice. Docker skips venv entirely.

**Each time you open a new terminal:**

```bash
cd healthcare-management-system-requirements-Python
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

---

### Option 3 — Production (no Docker)

```bash
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001 --workers 4
```

For production, also set `DEBUG=false` and use a strong `JWT_SECRET`.

---

## MongoDB Atlas setup

1. Create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Database Access** → create a user with read/write permissions
3. **Network Access** → add your IP address (or `0.0.0.0/0` for development)
4. **Connect** → Drivers → copy the connection string
5. Put the database name in the URL path and paste into `.env`:

```env
MONGODB_URL=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/medicare_plus?retryWrites=true&w=majority
SEED_DATABASE=true
```

6. Start the API (`./start.sh` or `uvicorn ...`)
7. In Atlas **Data Explorer**, click **Refresh** — you should see your database with collections

**Local MongoDB via Docker** (no Atlas):

```env
MONGODB_URL=mongodb://mongo:27017/medicare_plus
```

```bash
docker compose --profile local up -d --build
```

Local Mongo is exposed on port **27018**.

---

## Demo credentials

Password **`demo123`** for every account:

| Role | Email |
|------|-------|
| Patient | `patient@demo.com` |
| Doctor | `doctor@demo.com` |
| Admin | `admin@demo.com` |
| Pharmacist | `pharmacist@demo.com` |
| Lab Tech | `lab@demo.com` |
| Receptionist | `receptionist@demo.com` |
| Nurse | `nurse@demo.com` |
| Supplier | `supplier@demo.com` |

**Test login:**

```bash
curl -X POST http://localhost:8001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@demo.com","password":"demo123","role":"patient"}'
```

Use the returned `access_token` as: `Authorization: Bearer <token>`

**Re-seed manually:**

```bash
# Local
python -m app.seed.run_seed

# Docker
docker compose exec api python -m app.seed.run_seed
```

---

## API overview

Base path: **`/api/v1`**

| Group | Endpoints | Roles |
|-------|-----------|-------|
| **Auth** | `POST /auth/login`, `/signup`, `/refresh`, `GET /me`, `POST /logout` | Public / all |
| **Users** | `GET/POST /users`, `GET/PATCH/DELETE /users/:id`, `GET /users/patients`, `PATCH /users/me/profile` | Admin / staff |
| **Appointments** | `GET/POST /appointments`, `GET/PATCH/DELETE /appointments/:id` | Patient, Doctor, Admin, Reception |
| **Clinical** | `/doctors`, `/prescriptions`, `/medical-notes`, `/referrals`, `/family-members`, `/insurance`, `/health-timeline`, `/doctors/me/availability`, `/doctors/me/earnings` | Mixed |
| **Lab** | `/lab/reports`, `/lab/tests`, `/lab/catalog`, `/lab/samples`, `/lab/equipment`, `/lab/appointments` | Lab tech |
| **Pharmacy** | `/pharmacy/inventory`, `/orders`, `/fulfillment`, `/purchase-orders`, `/returns`, `/suppliers`, `/sales`, `/expiry-alerts` | Pharmacist, Patient |
| **Admin** | `/beds`, `/departments`, `/billing/invoices`, `/audit-log`, `/announcements`, `/doctor-onboarding`, `/analytics/summary`, `/notifications`, `/nurse/tasks`, `/supplier/*` | Admin / staff |
| **Messages** | `GET/POST /messages` | Doctor |
| **Health** | `GET /`, `GET /health`, `GET /ready` | Public |

---

## Interactive API docs

FastAPI auto-generates interactive documentation:

| URL | Description |
|-----|-------------|
| http://localhost:8001/docs | Swagger UI — try endpoints in the browser |
| http://localhost:8001/redoc | ReDoc — readable API reference |
| http://localhost:8001/openapi.json | Raw OpenAPI schema |

In Swagger UI, click **Authorize** and paste your JWT to test protected routes.

---

## Project structure

```
healthcare-management-system-requirements-Python/
├── app/
│   ├── main.py                 # FastAPI app + lifespan
│   ├── core/
│   │   ├── config.py           # Settings from .env
│   │   ├── mongo.py            # Parse db name from URL
│   │   ├── database.py         # Motor + Beanie connection
│   │   ├── security.py         # JWT + password hashing
│   │   ├── dependencies.py     # Auth dependencies
│   │   └── enums.py            # Role enums
│   ├── models/                 # Beanie document models
│   ├── schemas/                # Pydantic request/response DTOs
│   ├── api/v1/
│   │   ├── router.py           # Route aggregator
│   │   └── endpoints/          # auth, users, appointments, clinical, lab, pharmacy, admin, messages
│   ├── services/               # Shared business helpers
│   └── seed/                   # Demo data + extra dummy data
├── tests/                      # pytest suite
├── scripts/                    # Docker entrypoint, wait-for-mongo
├── Dockerfile
├── docker-compose.yml
├── start.sh                    # One-command Docker startup
├── requirements.txt
├── .env.example
└── pytest.ini
```

---

## Tests

```bash
# Local (requires MongoDB reachable via .env)
source .venv/bin/activate
pytest

# Docker
docker compose exec api pytest
```

---

## Docker commands

| Command | Description |
|---------|-------------|
| `./start.sh` | Build + start (auto-detects Atlas vs local Mongo) |
| `FOLLOW_LOGS=1 ./start.sh` | Start and follow API logs |
| `docker compose up -d --build api` | Start API only (Atlas) |
| `docker compose --profile local up -d --build` | Start API + local MongoDB |
| `docker compose logs -f api` | Stream API logs |
| `docker compose down` | Stop all containers |
| `docker compose exec api python -m app.seed.run_seed` | Re-seed inside container |
| `docker compose exec api pytest` | Run tests inside container |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `[Errno 98] Address already in use` on port 8001 | Docker API is already running. Use it at http://localhost:8001, or run `docker compose down` before starting uvicorn locally. |
| `MongoDB not connected` | Check Atlas **Network Access** (allow your IP). Verify `MONGODB_URL` in `.env`. |
| No database in Atlas | Start API with `SEED_DATABASE=true`, then click **Refresh** in Data Explorer. |
| `TypeError` with Python 3.8 venv | Use **Python 3.12+**: `python3.12 -m venv .venv` or use Docker instead. |
| Login returns 401 | Include correct `role` in login body. Demo password is `demo123`. |
| CORS errors from frontend | Add frontend URL to `CORS_ORIGINS` in `.env`. |
| `./start.sh` exits immediately | Normal — API runs in background. Check with `curl http://localhost:8001/health`. |

---

## Frontend integration

When ready to connect the [Next.js frontend](../healthcare-management-system-requirements-NEXT):

1. Set in frontend `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
   ```
2. Replace mock auth in `AuthContext` with `POST /auth/login`
3. Replace `mockData.ts` fetches module-by-module with real API calls
4. Generate TypeScript types from OpenAPI:
   ```bash
   npx openapi-typescript http://localhost:8001/openapi.json -o types/api.ts
   ```

The backend mirrors the frontend's types and mock data structure across all 8 roles.

---

## Ports reference

| Service | Port |
|---------|------|
| Python API | **8001** |
| Next.js frontend | 3000 |
| Local MongoDB (Docker profile) | 27018 |
| Node backend (sibling project) | 8002 |

---

## Quick reference

| Goal | Command |
|------|---------|
| **Dev (coding)** | `source .venv/bin/activate && uvicorn app.main:app --reload --port 8001` |
| **Stable / background** | `./start.sh` or `docker compose up -d --build api` |
| **Stop Docker** | `docker compose down` |
| **Health check** | `curl http://localhost:8001/health` |

---

## License

Demonstration / educational use.
