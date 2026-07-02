"""Additional dummy records — safe to run multiple times (skips existing)."""

from app.core.enums import (
    AppointmentStatus,
    AppointmentType,
    InvoiceStatus,
    LabReportStatus,
    NurseTaskStatus,
    NurseTaskType,
    OrderStatus,
)
from app.core.security import hash_password
from app.models.admin import Announcement, Invoice, NurseTask
from app.models.clinical import Appointment, MedicineItem, Prescription
from app.models.lab import LabReport
from app.models.pharmacy import InventoryItem, OrderMedicineItem, PharmacyOrder
from app.models.user import DoctorProfileEmbed, PatientProfileEmbed, User
from app.core.enums import UserRole


EXTRA_DOCTORS = [
    {
        "email": "emily.rodriguez@hospital.com",
        "name": "Dr. Emily Rodriguez",
        "specialization": "Pediatrics",
        "experience": 10,
        "fees": 400,
        "rating": 4.7,
        "reviews": 312,
        "location": "Chicago, IL",
        "availability_days": ["Tuesday", "Wednesday", "Thursday", "Friday"],
        "qualifications": ["MBBS", "MD Pediatrics"],
        "seed": "Emily",
    },
    {
        "email": "james.anderson@hospital.com",
        "name": "Dr. James Anderson",
        "specialization": "Orthopedics",
        "experience": 20,
        "fees": 550,
        "rating": 4.9,
        "reviews": 421,
        "location": "Houston, TX",
        "availability_days": ["Monday", "Tuesday", "Thursday", "Friday"],
        "qualifications": ["MBBS", "MS Orthopedics"],
        "seed": "James",
    },
    {
        "email": "priya.sharma@hospital.com",
        "name": "Dr. Priya Sharma",
        "specialization": "Dermatology",
        "experience": 8,
        "fees": 450,
        "rating": 4.6,
        "reviews": 156,
        "location": "San Francisco, CA",
        "availability_days": ["Monday", "Wednesday", "Friday", "Saturday"],
        "qualifications": ["MBBS", "MD Dermatology"],
        "seed": "Priya",
    },
    {
        "email": "robert.taylor@hospital.com",
        "name": "Dr. Robert Taylor",
        "specialization": "General Medicine",
        "experience": 18,
        "fees": 350,
        "rating": 4.8,
        "reviews": 523,
        "location": "Boston, MA",
        "availability_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "qualifications": ["MBBS", "MD General Medicine"],
        "seed": "Robert",
    },
]

EXTRA_PATIENTS = [
    {
        "email": "emma.thompson@demo.com",
        "name": "Emma Thompson",
        "phone": "+1 555-0102",
        "dob": "1996-04-22",
        "blood_group": "O+",
        "condition": "Arrhythmia",
    },
    {
        "email": "michael.brown@demo.com",
        "name": "Michael Brown",
        "phone": "+1 555-0103",
        "dob": "1979-11-08",
        "blood_group": "A+",
        "condition": "Coronary check",
    },
    {
        "email": "sophia.davis@demo.com",
        "name": "Sophia Davis",
        "phone": "+1 555-0104",
        "dob": "1972-07-19",
        "blood_group": "AB+",
        "condition": "High cholesterol",
    },
    {
        "email": "james.wilson@demo.com",
        "name": "James Wilson",
        "phone": "+1 555-0105",
        "dob": "1963-01-30",
        "blood_group": "B-",
        "condition": "Post bypass",
    },
    {
        "email": "olivia.martin@demo.com",
        "name": "Olivia Martin",
        "phone": "+1 555-0106",
        "dob": "1985-09-14",
        "blood_group": "A-",
        "condition": "Palpitations",
    },
]

EXTRA_INVENTORY = [
    ("Vitamin B Complex", "VIT001", 2500, "2026-03-20", "HealthPlus", 0.6),
    ("Aspirin 75mg", "ASP001", 4000, "2025-08-10", "MedSupply Inc", 0.3),
    ("Metformin 500mg", "MET001", 1800, "2025-11-30", "PharmaCorp", 0.9),
    ("Atorvastatin 10mg", "ATO001", 2200, "2026-01-15", "PharmaCorp", 1.1),
]


async def seed_extra_dummy_data() -> dict:
    """Insert extra demo records. Returns counts of newly created items."""
    password = hash_password("demo123")
    stats = {"doctors": 0, "patients": 0, "appointments": 0, "prescriptions": 0, "lab_reports": 0, "orders": 0, "inventory": 0, "invoices": 0, "nurse_tasks": 0, "announcements": 0}

    primary_doctor = await User.find_one(User.email == "doctor@demo.com")
    if not primary_doctor:
        return stats

    doctors: dict[str, User] = {"doctor@demo.com": primary_doctor}

    for d in EXTRA_DOCTORS:
        existing = await User.find_one(User.email == d["email"])
        if existing:
            doctors[d["email"]] = existing
            continue
        doc = await User(
            email=d["email"],
            hashed_password=password,
            name=d["name"],
            role=UserRole.DOCTOR,
            phone=f"+1234567{d['seed'][:3]}",
            avatar=f"https://api.dicebear.com/7.x/avataaars/svg?seed={d['seed']}",
            doctor_profile=DoctorProfileEmbed(
                specialization=d["specialization"],
                experience=d["experience"],
                fees=d["fees"],
                rating=d["rating"],
                reviews=d["reviews"],
                availability_days=d["availability_days"],
                location=d["location"],
                qualifications=d["qualifications"],
            ),
        ).insert()
        doctors[d["email"]] = doc
        stats["doctors"] += 1

    patients: list[User] = []
    main_patient = await User.find_one(User.email == "patient@demo.com")
    if main_patient:
        patients.append(main_patient)

    for p in EXTRA_PATIENTS:
        existing = await User.find_one(User.email == p["email"])
        if existing:
            patients.append(existing)
            continue
        try:
            user = await User(
                email=p["email"],
                hashed_password=password,
                name=p["name"],
                role=UserRole.PATIENT,
                phone=p["phone"],
                avatar=f"https://api.dicebear.com/7.x/avataaars/svg?seed={p['name']}",
                patient_profile=PatientProfileEmbed(
                    blood_group=p["blood_group"],
                    date_of_birth=p["dob"],
                    medical_history=[p["condition"]],
                ),
            ).insert()
        except Exception:
            existing = await User.find_one(User.email == p["email"])
            if not existing:
                raise
            user = existing
        patients.append(user)
        if not existing:
            stats["patients"] += 1

    emily = doctors.get("emily.rodriguez@hospital.com")
    michael_doc = doctors.get("michael.chen@hospital.com") or await User.find_one(User.email == "michael.chen@hospital.com")
    robert = doctors.get("robert.taylor@hospital.com")

    appointment_specs = [
        (patients[0] if patients else None, primary_doctor, "2024-02-20", "2:30 PM", AppointmentStatus.SCHEDULED, "Vaccination follow-up", AppointmentType.VIDEO, 400),
        (patients[1] if len(patients) > 1 else None, primary_doctor, "2024-02-14", "09:30 AM", AppointmentStatus.COMPLETED, "Coronary check", AppointmentType.IN_PERSON, 500),
        (patients[2] if len(patients) > 2 else None, robert, "2024-01-30", "03:00 PM", AppointmentStatus.COMPLETED, "Cholesterol review", AppointmentType.IN_PERSON, 350),
        (patients[3] if len(patients) > 3 else None, primary_doctor, "2024-02-12", "11:00 AM", AppointmentStatus.COMPLETED, "Post bypass follow-up", AppointmentType.IN_PERSON, 500),
        (patients[4] if len(patients) > 4 else None, emily, "2024-02-10", "04:00 PM", AppointmentStatus.SCHEDULED, "Palpitations consult", AppointmentType.VIDEO, 400),
    ]

    for patient, doctor, date, time, status, reason, apt_type, fees in appointment_specs:
        if not patient or not doctor:
            continue
        exists = await Appointment.find_one(
            Appointment.patient_id == patient.id,
            Appointment.doctor_id == doctor.id,
            Appointment.date == date,
            Appointment.time == time,
        )
        if exists:
            continue
        await Appointment(
            patient_id=patient.id,
            patient_name=patient.name,
            doctor_id=doctor.id,
            doctor_name=doctor.name,
            doctor_specialization=doctor.doctor_profile.specialization if doctor.doctor_profile else "General",
            date=date,
            time=time,
            status=status,
            reason=reason,
            appointment_type=apt_type,
            fees=fees,
        ).insert()
        stats["appointments"] += 1

    for patient in patients[1:4]:
        exists = await Prescription.find_one(Prescription.patient_id == patient.id, Prescription.diagnosis == "Routine medication review")
        if exists:
            continue
        doc = michael_doc or primary_doctor
        await Prescription(
            patient_id=patient.id,
            doctor_id=doc.id,
            date="2024-02-01",
            diagnosis="Routine medication review",
            medicines=[
                MedicineItem(name="Atorvastatin 10mg", dosage="1 tablet", frequency="Once daily", duration="30 days"),
                MedicineItem(name="Aspirin 75mg", dosage="1 tablet", frequency="Once daily", duration="30 days"),
            ],
            notes="Follow up in 4 weeks",
        ).insert()
        stats["prescriptions"] += 1

    lab_tests = [
        (patients[1] if len(patients) > 1 else None, "Thyroid Panel (T3, T4, TSH)", "2024-02-13", LabReportStatus.COMPLETED, "All values within normal range"),
        (patients[2] if len(patients) > 2 else None, "Liver Function Test", "2024-02-14", LabReportStatus.PENDING, None),
        (patients[3] if len(patients) > 3 else None, "Blood Glucose (Fasting)", "2024-02-12", LabReportStatus.COMPLETED, "Slightly elevated - 110 mg/dL"),
        (patients[4] if len(patients) > 4 else None, "Lipid Profile", "2024-02-11", LabReportStatus.IN_PROGRESS, None),
    ]
    for patient, test_name, date, status, summary in lab_tests:
        if not patient:
            continue
        exists = await LabReport.find_one(LabReport.patient_id == patient.id, LabReport.test_name == test_name, LabReport.date == date)
        if exists:
            continue
        await LabReport(
            patient_id=patient.id,
            test_name=test_name,
            date=date,
            status=status,
            results_summary=summary,
        ).insert()
        stats["lab_reports"] += 1

    for patient in patients[1:3]:
        exists = await PharmacyOrder.find_one(PharmacyOrder.patient_id == patient.id, PharmacyOrder.date == "2024-02-08")
        if exists:
            continue
        await PharmacyOrder(
            patient_id=patient.id,
            medicines=[
                OrderMedicineItem(name="Paracetamol 500mg", quantity=20, price=8),
                OrderMedicineItem(name="Vitamin B Complex", quantity=30, price=15),
            ],
            total=53,
            status=OrderStatus.SHIPPED,
            date="2024-02-08",
            address="456 Oak Ave, New York, NY 10002",
        ).insert()
        stats["orders"] += 1

    for inv in EXTRA_INVENTORY:
        exists = await InventoryItem.find_one(InventoryItem.batch_number == inv[1])
        if exists:
            continue
        await InventoryItem(
            medicine_name=inv[0],
            batch_number=inv[1],
            quantity=inv[2],
            expiry_date=inv[3],
            supplier=inv[4],
            price=inv[5],
        ).insert()
        stats["inventory"] += 1

    for patient in patients[1:4]:
        exists = await Invoice.find_one(Invoice.patient_id == patient.id, Invoice.service == "General Consultation")
        if exists:
            continue
        await Invoice(
            patient_id=patient.id,
            patient_name=patient.name,
            service="General Consultation",
            date="2024-02-05",
            amount=350,
            status=InvoiceStatus.PENDING,
        ).insert()
        stats["invoices"] += 1

    nurse_specs = [
        ("Michael Brown", "201", NurseTaskType.CARE, "Record vitals", "07:30 AM"),
        ("Sophia Davis", "301", NurseTaskType.MEDICATION, "Evening medication round", "06:00 PM"),
        ("James Wilson", "101", NurseTaskType.CARE, "Post-op assessment", "09:00 AM"),
    ]
    for pname, room, task_type, desc, scheduled in nurse_specs:
        exists = await NurseTask.find_one(NurseTask.patient_name == pname, NurseTask.scheduled == scheduled)
        if exists:
            continue
        await NurseTask(
            patient_name=pname,
            room=room,
            task_type=task_type,
            description=desc,
            scheduled=scheduled,
            status=NurseTaskStatus.PENDING,
        ).insert()
        stats["nurse_tasks"] += 1

    ann_title = "Welcome to MediCare Plus"
    if not await Announcement.find_one(Announcement.title == ann_title):
        await Announcement(
            title=ann_title,
            message="Hospital management system is live with demo data for all roles.",
            target_roles=["all"],
        ).insert()
        stats["announcements"] += 1

    return stats
