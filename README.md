<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2563EB,100:8B5CF6&height=200&section=header&text=MediCare%20Plus&fontSize=60&fontColor=ffffff&fontAlignY=35&desc=A%20Complete%20Hospital%20Management%20System&descAlignY=55&descSize=20&animation=fadeIn" width="100%"/>

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)

<br/>

**A production-style hospital management platform with 8 role-based portals — appointments, pharmacy, lab workflows, billing, messaging, and more — backed by a real FastAPI + MongoDB API.**

[Overview](#-overview) • [Tech Stack](#️-tech-stack) • [Features](#-features-in-detail) • [User Roles](#-user-roles) • [Architecture](#️-architecture) • [Getting Started](#-getting-started) • [Testing](#-testing)

<br/>

| 👥 8 Roles | 📄 ~90 Pages | 🔌 80+ Endpoints | ✅ 28 Backend Tests | 🌗 Dark Mode | 📱 Fully Responsive |
|:---:|:---:|:---:|:---:|:---:|:---:|

</div>

---

## 📖 Overview

**MediCare Plus** is a full-stack healthcare management system built as two independently running applications that talk to each other purely over a REST API:

| App | What it is |
|---|---|
| 🖥️ **Frontend** | A Next.js 16 web app with a dedicated dashboard for each of 8 hospital roles |
| ⚙️ **Backend** | A FastAPI REST API backed by MongoDB, handling auth, records, and every domain operation |

Every appointment, prescription, lab report, invoice, and inventory item you see in the UI is a genuine document stored in MongoDB, fetched live through JWT-authenticated requests — nothing runs on fake or hardcoded data.

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | React framework, routing, rendering |
| **React 19** | UI library |
| **TypeScript 5** | Type safety across ~90 pages and the entire API layer |
| **Tailwind CSS 4** | Styling — fully responsive, light/dark theming |
| **Framer Motion** | Page and component animation |
| **Recharts** | Analytics charts (sales, earnings, patient growth) |
| **Lucide React** | Icon set |

### Backend

| Technology | Purpose |
|---|---|
| **FastAPI** | REST API framework |
| **Python 3.12** | Runtime |
| **Beanie + Motor** | Async MongoDB ODM / driver |
| **MongoDB Atlas** | Database |
| **Pydantic v2** | Request/response validation & schemas |
| **PyJWT + bcrypt** | JWT auth (access + refresh tokens) & password hashing |
| **Uvicorn** | ASGI server |
| **pytest + pytest-asyncio** | Backend test suite |

---

## 🌟 Features in Detail

### 🗓️ Appointments & Scheduling
- Patients search doctors by specialization and book by date, time, and visit type (**in-person / video / chat**)
- Doctors manage their schedule, mark visits completed or cancelled, and set weekly availability & consultation hours
- Receptionists can book on behalf of a walk-in or existing patient and manage the full appointment list
- Admins get a hospital-wide view of every appointment across every doctor

### 💊 Pharmacy
- Patient storefront — browse the medicine catalog with category filters, add to cart, checkout with a delivery address
- Order tracking through a 4-stage pipeline: **pending → confirmed → shipped → delivered**
- Pharmacist inventory management — stock levels, batch numbers, expiry dates, pricing
- Automatic **low-stock** and **expiry** alerts
- Prescription fulfillment workflow: **pending → dispensing → dispensed**
- Purchase orders to suppliers, return requests with an approval workflow, and a supplier directory
- Sales analytics — monthly revenue trend and top-selling medicines

### 🧪 Laboratory
- Barcode-driven sample tracking through a 5-stage pipeline: **collected → in-transit → received → processing → completed**
- Test catalog with pricing and turnaround times per category
- Equipment calibration tracking with one-click QC runs and scoring
- Structured result entry — parameter, value, reference range, and abnormal-value flags
- Lab collection appointment scheduling and a technician test queue with priority levels

### 📋 Clinical Records
- Prescriptions with structured medicine entries (dosage, frequency, duration, instructions)
- Doctor medical notes per patient, optionally attached to vitals
- Specialist referrals with urgency levels (routine/urgent) and status tracking
- Patient-managed family member profiles and personal insurance policy details (deductible, coverage, copays)
- A unified **health timeline** merging appointments, prescriptions, and lab reports into a single chronological feed

### 🛏️ Hospital Operations
- Bed/room management across ICU, Private, and General wards with live occupancy status
- Department directory — staff counts and bed allocation
- Doctor onboarding approval queue for new registrations
- System-wide audit log tracking user, settings, security, and billing actions
- Role-targeted announcements broadcast across the hospital

### 💵 Billing
- Per-patient invoices with paid / pending / overdue status
- One-click **Pay Invoice** for patients
- Admin-wide invoice oversight and revenue tracking

### 💬 Messaging
- Threaded doctor ↔ patient conversations with per-side unread counts

### 📊 Dashboards & Analytics
- Every role opens to a **live** dashboard — today's stats, quick actions, and recent activity, all sourced from real data
- Admin analytics — total users, appointments, bed occupancy, department count
- Doctor earnings breakdown with a monthly trend chart and transaction history
- Pharmacy sales summary with a monthly chart and top sellers

### 🔐 Auth & Access Control
- JWT **access + refresh tokens**, with silent refresh-and-retry on expiry
- 8 role-gated portals — permissions are enforced **server-side per endpoint**, not just hidden in the UI
- Self-service signup for patients; every staff role is provisioned by an admin

### 🎨 Experience
- Full **dark mode** — system-preference aware, toggled and persisted per browser
- **Fully responsive** on every one of the ~90 pages, from mobile to desktop
- Framer Motion micro-animations throughout every dashboard

---

## 👥 User Roles

Each role gets its own portal — dedicated navigation, dashboard, and permissions enforced by the backend.

| Role | Portal highlights |
|---|---|
| 🧑‍🤝‍🧑 **Patient** | Book appointments, order medicines, view prescriptions & lab reports, track billing, manage family & insurance, health timeline |
| 🩺 **Doctor** | Manage appointments & availability, write prescriptions, patient records & notes, referrals, message patients, track earnings |
| 🛡️ **Admin** | User management, doctor onboarding, hospital-wide analytics, billing, beds & departments, audit log, announcements |
| 💊 **Pharmacist** | Inventory, order fulfillment, purchase orders, returns, supplier directory, expiry alerts, sales analytics |
| 🔬 **Lab Technician** | Sample tracking (barcode workflow), test catalog, equipment QC, results entry, collection appointments |
| 🧾 **Receptionist** | Book/manage appointments, patient directory, room assignment |
| 👩‍⚕️ **Nurse** | Assigned patients, care task management |
| 🚚 **Supplier** | Product catalog, incoming orders from the hospital |

---

## 🏗️ Architecture

Two independent apps connected purely over a REST API — no shared code or monorepo tooling, just `NEXT_PUBLIC_API_URL` pointing the frontend at the backend.

### Frontend — `healthcare-management-system-requirements-NEXT/`

<details>
<summary><strong>📂 Click to expand full folder structure</strong></summary>

```text
app/
├── layout.tsx, page.tsx, globals.css     — root layout + public marketing site
├── login/, signup/                        — auth screens
├── privacy-policy/, terms-of-service/     — legal pages
├── unauthorized/                          — role-mismatch fallback
│
├── patient/     (17 pages)  dashboard · appointments · book-appointment · doctors
│                             prescriptions · lab-reports · pharmacy · billing
│                             family · insurance · timeline · notifications
│                             consultation/[id] · help · settings · profile
│
├── doctor/      (14 pages)  dashboard · appointments · availability · patients
│                             patients/[id] · notes · prescriptions · referrals
│                             messages · earnings · consultation/[id]
│                             settings · profile
│
├── admin/       (14 pages)  dashboard · users · doctor-onboarding · appointments
│                             beds · inventory · departments · analytics · billing
│                             audit-log · announcements · settings · profile
│
├── pharmacy/    (12 pages)  dashboard · inventory · orders · prescriptions
│                             (fulfillment) · purchase-orders · returns
│                             suppliers · sales · expiry-alerts · settings · profile
│
├── lab/         (10 pages)  dashboard · catalog · samples · reports · equipment
│                             appointments · tests · settings · profile
│
├── reception/    (7 pages)  dashboard · appointments · patients · rooms
│                             settings · profile
│
├── nurse/        (6 pages)  dashboard · patients · tasks · settings · profile
│
└── supplier/     (6 pages)  dashboard · products · orders · settings · profile

api/                      ← one typed module per backend entity — the entire
├── appointments.ts       ← API surface of the app lives in this one folder
├── auth.ts
├── billing.ts
├── doctors.ts
├── lab.ts
├── pharmacy.ts
├── users.ts
└── ... (23 files total, one per domain: announcements, auditLog, beds,
        departments, doctorOnboarding, familyMembers, healthTimeline,
        insurance, medicalNotes, messages, notifications, nurseTasks,
        prescriptions, referrals, supplier)

lib/
├── api.ts                 — fetch client: JWT header, auto refresh + retry, ApiError
├── authToken.ts            — localStorage token read/write
├── mappers.ts               — backend snake_case → frontend camelCase, shared types
└── colorClasses.ts, exportReport.ts, notificationIcons.ts, profileConfig.ts

contexts/
├── AuthContext.tsx          — real login / signup / logout / refresh, current user
├── NotificationContext.tsx  — live notification feed
└── ThemeContext.tsx         — light/dark mode, system-aware, persisted

components/
├── DashboardLayout.tsx      — shared shell: navbar, sidebar, role nav, notifications
├── ProtectedRoute.tsx       — role-gated route wrapper
├── RoleProfilePage.tsx      — shared profile page driven by profileConfig
└── DoctorCard.tsx, MedicineCard.tsx, CartItemRow.tsx, ThemeToggle.tsx, ...

types/index.ts              — shared domain types (User, Appointment, Doctor, ...)
data/mockData.ts            — legacy fixtures (superseded by live API data)
```

</details>

### Backend — `healthcare-management-system-requirements-Python/`

<details>
<summary><strong>📂 Click to expand full folder structure</strong></summary>

```text
app/
├── main.py                      — FastAPI app, lifespan, CORS, health checks
│
├── api/v1/
│   ├── router.py                 — aggregates every endpoint group
│   └── endpoints/
│       ├── auth.py                — login, signup, refresh, me, logout
│       ├── users.py                — admin user CRUD, patient directory, profile
│       ├── appointments.py         — book / list / update / cancel
│       ├── clinical.py             — doctors, prescriptions, medical notes,
│       │                            referrals, family members, insurance,
│       │                            health timeline, availability & earnings
│       ├── lab.py                  — reports, catalog, samples, equipment, tests
│       ├── pharmacy.py             — inventory, orders, fulfillment, purchase
│       │                            orders, returns, suppliers, sales
│       ├── admin_ops.py            — beds, departments, billing, audit log,
│       │                            announcements, doctor onboarding,
│       │                            analytics, notifications, nurse tasks,
│       │                            supplier portal
│       └── messages.py             — doctor ↔ patient chat threads
│
├── core/
│   ├── config.py                  — Settings, loaded from .env
│   ├── security.py                 — JWT issue/verify, password hashing
│   ├── enums.py                    — UserRole and every status/type enum
│   ├── dependencies/
│   │   └── roles.py                 — per-role guards (AdminUser, DoctorUser,
│   │                                 PatientUser, PharmacistOrAdminUser, ...)
│   ├── exceptions/                 — typed AppError → JSON error responses
│   └── middleware/                 — request-id, logging, security headers
│
├── models/                       — Beanie ODM documents (MongoDB collections)
│   └── user.py, clinical.py, lab.py, pharmacy.py, admin.py, messaging.py
│
├── schemas/                      — Pydantic request/response DTOs, 1:1 with models/
│
├── services/                     — business logic, one file per domain
│
└── seed/
    ├── seed_data.py               — 8 demo accounts + core sample data
    └── extra_dummy_data.py        — additional doctors/patients for richer demos

tests/
├── test_all_endpoints.py         — every endpoint, all 8 roles, full CRUD
├── test_api.py                   — role login + domain smoke tests
└── test_health.py
```

</details>

### How a request flows end-to-end

```text
 Browser
   │
   ▼
 Next.js page  ──▶  api/<entity>.ts  ──▶  lib/api.ts  ──[ JWT Bearer ]──▶  FastAPI route
   ▲                                          │                                │
   │                                    auto-refreshes                  role dependency
   │                                    expired tokens                  (e.g. PharmacistUser)
   │                                                                            │
   └────────────────────── JSON response ◀─────────────────────────── MongoDB (via Beanie)
```

1. A page calls a typed function from `api/<entity>.ts` (e.g. `listAppointments()`).
2. That function calls the shared `lib/api.ts` client, which attaches the JWT and — if the token has expired — silently refreshes it and retries once before the caller ever sees an error.
3. The request hits a FastAPI route guarded by a **role dependency**, so authorization can't be bypassed from the frontend even if the UI were modified.
4. The route calls into `services/`, which reads/writes MongoDB through Beanie models, and returns a Pydantic-validated response.

---

## 🚀 Getting Started

### 1. Backend

```bash
cd healthcare-management-system-requirements-Python
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # add your MongoDB Atlas connection string
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

API docs: `http://localhost:8001/docs`

### 2. Frontend

```bash
cd healthcare-management-system-requirements-NEXT
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1" > .env.local
npm run dev
```

App: `http://localhost:3000`

### 3. Log in with a demo account

The backend seeds one demo account per role — **password `demo123`** for all:

| Role | Email |
|---|---|
| Patient | `patient@demo.com` |
| Doctor | `doctor@demo.com` |
| Admin | `admin@demo.com` |
| Pharmacist | `pharmacist@demo.com` |
| Lab Technician | `lab@demo.com` |
| Receptionist | `receptionist@demo.com` |
| Nurse | `nurse@demo.com` |
| Supplier | `supplier@demo.com` |

---

## 🧪 Testing

```bash
cd healthcare-management-system-requirements-Python
pytest tests/ -v
```

The suite exercises **every endpoint across all 8 roles** — auth flow (login/refresh/me/logout/signup), full CRUD paths per role, and confirms protected routes correctly reject unauthenticated requests.

The frontend is verified via `tsc --noEmit`, `eslint`, a full production build, and a scripted Playwright pass that logs into all 8 roles and visits every page checking for console and network errors.

---

<br/>

<div align="center">

### 👨‍💻 Developed & Maintained by

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=28&duration=3000&pause=1000&color=8B5CF6&center=true&vCenter=true&width=500&lines=Jenish+Gondaliya" alt="Jenish Gondaliya" />

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:8B5CF6,100:2563EB&height=120&section=footer" width="100%"/>

</div>
