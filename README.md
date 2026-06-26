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
- Appointments — view, filter, book
- Find Doctors — search and browse specialists
- Prescriptions — view and download
- Lab Reports — completed and pending results
- Pharmacy — browse medicines, cart, order history
- Profile — edit personal and medical info
- Settings — notifications, password, preferences

### Doctor (`/doctor/*`)

- Dashboard — today’s appointments, stats, quick actions
- Appointments — manage consultations (in-person & video)
- Patients — patient list with records
- Prescriptions — issue prescriptions (with modal)
- Earnings — revenue charts and transactions
- Availability — working days and time slots
- Profile & Settings

### Admin (`/admin/*`)

- Dashboard — hospital KPIs, charts, bed overview
- Users — user management table with role filters
- Appointments — hospital-wide appointment list
- Beds — interactive bed status management
- Analytics — patient growth, department load, charts
- Billing — invoices and payment status
- Profile & Settings

### Pharmacist (`/pharmacy/*`)

- Dashboard — inventory alerts, low stock, expiring items
- Inventory — stock table, add medicine modal
- Orders — fulfill orders with status stepper
- Suppliers — supplier directory
- Sales — monthly sales charts and top products
- Profile & Settings

### Lab Technician (`/lab/*`)

- Dashboard — test queue and recent activity
- Tests — pending / in-progress / completed workflow, upload results
- Reports — view and download generated reports
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
