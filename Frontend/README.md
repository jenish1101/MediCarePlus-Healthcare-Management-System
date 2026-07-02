# MediCare Plus — Healthcare Management System

A full-featured **hospital management system** built with **Next.js 16 (App Router)**. It supports multiple user roles — patients, doctors, admins, pharmacists, and lab technicians — each with a dedicated dashboard and tailored workflows for appointments, telemedicine, pharmacy, lab tests, billing, and more.

This project is a Next.js migration of the original React (Vite) healthcare application, with role-based routing, mock authentication, and a modern responsive UI.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React
- **Auth:** Client-side mock auth with `localStorage` (demo only)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn / pnpm)

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

---

## Demo Login Credentials

Authentication is **mock/demo only** — there is no real backend. Use the emails below with the matching role selected on the login page.

| Role        | Email                 | Password  | Dashboard route        |
|-------------|-----------------------|-----------|------------------------|
| **Patient** | `patient@demo.com`    | `demo123` | `/patient/dashboard`   |
| **Doctor**  | `doctor@demo.com`     | `demo123` | `/doctor/dashboard`    |
| **Admin**   | `admin@demo.com`      | `demo123` | `/admin/dashboard`     |
| **Pharmacist** | `pharmacist@demo.com` | `demo123` | `/pharmacy/dashboard` |
| **Lab Tech** | `lab@demo.com`       | `demo123` | `/lab/dashboard`       |
| **Receptionist** | `receptionist@demo.com` | `demo123` | `/reception/dashboard` |
| **Nurse** | `nurse@demo.com` | `demo123` | `/nurse/dashboard` |
| **Supplier** | `supplier@demo.com` | `demo123` | `/supplier/dashboard` |

**Login URL:** [http://localhost:3000/login](http://localhost:3000/login)

> Select the correct **role** on the login form before signing in. The email must match the role (e.g. `doctor@demo.com` only works when **Doctor** is selected).

### Patient signup

New patients can register at [http://localhost:3000/signup](http://localhost:3000/signup). Signup creates a local session and redirects to the patient dashboard. Staff roles (doctor, admin, pharmacist, lab tech) are **not** self-registerable — they are provisioned by an administrator in a real deployment.

---

## Features by Role

### Public

- **Landing page** — Hero, stats, services, role portals, CTA, animated sections
- **Login** — Role-based sign-in with demo credentials
- **Signup** — Patient registration only
- **Privacy Policy** — `/privacy-policy`
- **Terms of Service** — `/terms-of-service`

### Patient (`/patient/*`)

- Dashboard with health overview and quick actions
- **Book Appointment** — 4-step wizard (doctor → date → time → confirm)
- Appointments — view, filter, join video calls
- **Video Consultation** — `/patient/consultation/[id]` mock telemedicine room
- Find Doctors — search, browse, book with pre-selected doctor
- Prescriptions — view and download
- Lab Reports — completed and pending results
- Pharmacy — browse medicines, cart, order history
- **Health Timeline** — unified appointments, prescriptions, and labs
- **Billing & Payments** — invoices, pay online
- **Family Members** — manage dependents under one account
- **Insurance** — coverage details and deductible progress
- **Notifications** — full notification center with filters
- **Help & FAQ** — support, emergency info, live chat
- Profile — edit personal and medical info
- Settings — notifications, password, preferences

### Doctor (`/doctor/*`)

- Dashboard — today’s appointments, stats, quick actions
- Appointments — manage consultations; start video calls, view patients, add notes
- **Patient detail** — `/doctor/patients/[id]` with history, notes, and vitals tabs
- **Video consultation** — `/doctor/consultation/[id]` mock telemedicine room
- **Medical Notes (EMR)** — visit notes per appointment with create modal
- **Referrals** — refer patients to specialists with urgency tracking
- **Messages** — secure patient messaging (mock chat)
- Prescriptions — issue prescriptions (with modal)
- Earnings — revenue charts and transactions
- Availability — working days and time slots (separate from Settings)
- Profile — direct sidebar link; Settings via footer

### Admin (`/admin/*`)

- Dashboard — hospital KPIs, charts, bed overview, quick actions
- **Users** — add/edit user modal, role filters, toggle status, delete
- **Doctor onboarding** — approve or reject pending doctor registrations
- Appointments — hospital-wide appointment list
- Beds — interactive bed status management
- **Inventory** — hospital-wide pharmacy stock overview
- **Departments** — manage departments (Cardiology, Pediatrics, etc.)
- Analytics — patient growth, department load; **export CSV/PDF**
- Billing — invoices and payment status; **export CSV/PDF**
- **Audit log** — track who changed what across the system
- **Announcements** — broadcast messages to all roles
- Profile & Settings

### Pharmacist (`/pharmacy/*`)

- Dashboard — inventory alerts, low stock, expiring items, quick actions
- Prescriptions — link doctor prescription to dispense order
- Inventory — stock table, add medicine modal
- Orders — fulfill orders with status stepper
- Expiry Alerts — dedicated low-stock / expiry view
- Purchase Orders — order stock from suppliers
- Returns — handle cancelled orders and refunds
- Suppliers — supplier directory
- Sales — monthly sales charts and top products
- Profile & Settings

### Lab Technician (`/lab/*`)

- Dashboard — test queue, recent activity, quick links
- Tests — pending / in-progress / completed workflow, upload results
- Test Catalog — available tests and pricing
- Sample Tracking — barcode / sample ID workflow
- Reports — view and download lab report PDFs
- Equipment / QC — lab equipment status and quality control
- Appointments — sample collection schedule
- Profile & Settings

### Shared (all roles)

- Responsive sidebar + top navbar
- **Notifications** dropdown (bell icon)
- **Profile** page via avatar click
- **Logout** confirmation modal
- **Settings** link in sidebar footer
- Role-based route protection

---

## Project Structure

```
healthcare-management-system-requirements-NEXT/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── login/              # Login
│   ├── signup/             # Patient signup
│   ├── patient/            # Patient portal
│   ├── doctor/             # Doctor portal
│   ├── admin/              # Admin portal
│   ├── pharmacy/           # Pharmacy portal
│   ├── lab/                # Laboratory portal
│   ├── privacy-policy/
│   └── terms-of-service/
├── components/             # Shared UI (DashboardLayout, ProtectedRoute, etc.)
├── contexts/               # AuthContext (mock login/signup)
├── data/                   # Mock data (doctors, appointments, etc.)
├── types/                  # TypeScript interfaces
└── public/                 # Static assets
```

---

## Notes

- **Mock data:** Appointments, prescriptions, inventory, and other data are static mock datasets in `data/mockData.ts`.
- **No backend:** Login/signup store the user in `localStorage`. Refreshing after logout requires demo credentials again for staff; signup sessions are browser-local only.
- **Turbopack:** If module resolution fails due to a stray `yarn.lock` outside the project, `next.config.ts` sets `turbopack.root` explicitly to the project directory.

---

## License

This project is for demonstration and educational purposes.
