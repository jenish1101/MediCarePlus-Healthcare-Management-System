# MediCare Plus — Feature Suggestions & Roadmap

This document lists **possible new pages and features** for `healthcare-management-system-requirements-NEXT`. It is a planning guide for future work — not everything here is implemented yet.

For current features and demo login credentials, see [README.md](./README.md).

---

## Current State (Summary)

| Role | Status |
|------|--------|
| **Patient, Doctor, Admin, Pharmacy, Lab** | Dashboard + main pages implemented |
| **Receptionist, Nurse, Supplier** | Defined in types & sidebar nav — **no pages yet** |
| **Authentication** | Mock only (`localStorage`, demo emails) |

Many UI buttons are **visual only** (e.g. Book Appointment, Join Call, Download, Add User) — they look correct but do not persist data to a backend.

---

<!-- ## 1. Entirely New Roles (Biggest Gap)

These roles exist in `UserRole` and `DashboardLayout` navigation, but have **no routes or pages** yet.

### Receptionist (`/reception/*`)

| Page | Description |
|------|-------------|
| Dashboard | Today's check-ins, walk-ins |
| Appointments | Book / reschedule for patients |
| Patients | Register walk-in patients |
| Rooms | Bed / room assignment (lighter than admin beds) |

**Also needed:** Demo login in `AuthContext` (e.g. `receptionist@demo.com`).

### Nurse (`/nurse/*`)

| Page | Description |
|------|-------------|
| Dashboard | Assigned patients, vitals due |
| Patients | Ward list, vitals history |
| Tasks | Medication rounds, care tasks |

**Also needed:** Demo login (e.g. `nurse@demo.com`).

### Supplier (`/supplier/*`)

| Page | Description |
|------|-------------|
| Dashboard | Pending supply orders |
| Products | Catalog / stock offered to hospital |
| Orders | Fulfill pharmacy purchase orders |

**Also needed:** Demo login (e.g. `supplier@demo.com`). -->

---

<!-- ## 2. New Pages & Features by Existing Role

### Patient

| Feature | Description |
|---------|-------------|
| **Book Appointment flow** | Multi-step wizard: doctor → date → time → confirm |
| **Video consultation room** | `/patient/consultation/[id]` — mock video UI for telemedicine |
| **Payment / Billing** | View invoices, pay online (ties to admin billing) |
| **Family members** | Manage dependents under one account |
| **Health timeline** | Unified timeline: appointments + prescriptions + labs |
| **Insurance** | Dedicated insurance / coverage page |
| **Notifications center** | Full notifications page (not only navbar dropdown) |
| **Help / FAQ** | Support and emergency information |

### Doctor

| Feature | Description |
|---------|-------------|
| **Patient detail page** | `/doctor/patients/[id]` — history, notes, vitals |
| **Video consultation** | Start / join call from appointments |
| **Medical notes / EMR** | Visit notes per appointment |
| **Referrals** | Refer patient to specialist |
| **Messages / Chat** | Patient messaging (mock) |
| **Profile in sidebar** | Direct nav link (today: avatar only) |
| **Nav cleanup** | Separate **Availability** vs **Settings** (Availability currently uses Settings icon) |

### Admin

| Feature | Description |
|---------|-------------|
| **Add / Edit User modal** | Wire up "Add User" with create/edit flow |
| **Doctor onboarding** | Approve doctor registrations |
| **Reports export** | PDF / CSV for analytics & billing |
| **Inventory overview** | Hospital-wide pharmacy stock view |
| **Audit log** | Track who changed what |
| **System announcements** | Broadcast messages to all roles |
| **Departments** | Manage departments (Cardiology, Pediatrics, etc.) |

### Pharmacy

| Feature | Description |
|---------|-------------|
| **Prescription fulfillment** | Link doctor prescription → dispense order |
| **Expiry alerts page** | Dedicated low-stock / expiry view |
| **Purchase orders** | Order stock from suppliers |
| **Returns / refunds** | Handle cancelled orders |

### Lab

| Feature | Description |
|---------|-------------|
| **Test catalog** | Available tests + pricing |
| **Sample tracking** | Barcode / sample ID workflow |
| **Report PDF viewer** | Real view/download for lab reports |
| **Equipment / QC** | Lab equipment status | -->

---

## 3. Cross-Cutting Features (All Roles)

| Feature | Description |
|---------|-------------|
| **Role-specific notifications** | Different mock notifications per role; mark as read |
| **Global search** | Search patients, appointments, medicines from navbar |
| **Dark mode** | Apply theme from settings toggles |
| **Forgot password** | Password reset flow on login page |
| **Real API layer** | Replace mock auth + `mockData` with REST or GraphQL |
| **Internationalization (i18n)** | Multi-language support |
| **Accessibility** | Skip links, ARIA on modals, keyboard navigation |
| **Custom 404 / unauthorized** | Role-aware error pages |

---

## 4. Recommended Priority

### High impact (demo-friendly, no backend required)

1. **Book Appointment wizard** (patient) — completes the core patient journey  
2. **Patient detail page** (doctor) — connects appointments ↔ patients  
3. **Receptionist role** — common in hospital systems; nav already exists  
4. **Wire "Add User"** (admin) — modal + local state  
5. **Notifications page** — all roles  
6. **Video consultation mock UI** — patient + doctor  

### Medium priority

- Nurse + Supplier roles  
- Patient payment / billing  
- Prescription → pharmacy handoff  

### Later (requires backend)

- Real authentication & database  
- File uploads for lab reports  
- Email / SMS appointment reminders  
- Payment gateway integration  

---

## 5. Quick Wins (No New Pages)

Improvements that can be done **without** adding new routes:

| Item | Action |
|------|--------|
| Dashboard "View All" | Link to the correct list page per role |
| Book Appointment buttons | Route to `/patient/appointments` or booking wizard |
| Find Doctors "Book" | Open booking flow for selected doctor |
| Doctor Quick Actions | Link to prescriptions / availability pages |
| Notifications "Mark all as read" | Update local notification state |
| Profile Save | Persist edits to `AuthContext` / `localStorage` |
| Footer / legal links | Already at `/privacy-policy` and `/terms-of-service` |

---

## 6. Implementation Notes

When adding new pages:

1. Create route under `app/<role>/<page>/page.tsx`
2. Wrap with `ProtectedRoute` and `DashboardLayout`
3. Add nav item in `components/DashboardLayout.tsx` if needed
4. Extend `mockData.ts` or local state for demo data
5. For new roles, add mock user in `contexts/AuthContext.tsx` and login role selector in `app/login/LoginForm.tsx`
6. Update [README.md](./README.md) with new routes and credentials

---

## Summary

**Yes — many more pages and features can be added.** The largest gaps today are:

1. **Three roles with no pages** — Receptionist, Nurse, Supplier  
2. **End-to-end flows** — book appointment, video call, prescription → pharmacy  
3. **Detail pages** — single patient, appointment, lab report  
4. **Backend integration** — when moving beyond demo / prototype  

Pick a section from the priority list above to implement next.
