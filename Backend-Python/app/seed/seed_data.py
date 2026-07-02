"""Seed database with demo data matching the Next.js frontend mock datasets."""

from app.core.enums import (
    AnnouncementStatus,
    AppointmentStatus,
    AppointmentType,
    AuditCategory,
    BedStatus,
    BedType,
    CatalogTestStatus,
    DepartmentStatus,
    EquipmentStatus,
    FulfillmentStatus,
    InvoiceStatus,
    LabReportStatus,
    NotificationCategory,
    NurseTaskStatus,
    NurseTaskType,
    OnboardingStatus,
    OrderStatus,
    ProductStatus,
    PurchaseOrderStatus,
    ReferralStatus,
    ReferralUrgency,
    ReturnStatus,
    SampleStatus,
    UserRole,
)
from app.core.security import hash_password
from app.models.admin import (
    Announcement,
    AuditLogEntry,
    Bed,
    Department,
    Invoice,
    Notification,
    NurseTask,
    SupplierOrder,
    SupplierProduct,
)
from app.models.clinical import Appointment, MedicalNote, Prescription, Referral
from app.models.clinical import MedicineItem
from app.models.lab import LabCollectionAppointment, LabEquipment, LabReport, LabSample, LabTestCatalog
from app.models.messaging import ChatMessage, MessageThread
from app.models.pharmacy import (
    FulfillmentPrescription,
    InventoryItem,
    OrderMedicineItem,
    PharmacyOrder,
    PurchaseOrder,
    PurchaseOrderItem,
    ReturnRequest,
    SupplierInfo,
)
from app.models.user import DoctorProfileEmbed, FamilyMember, InsuranceCoverageItem, InsurancePolicy, PatientProfileEmbed, User


async def seed_database() -> None:
    existing = await User.find_one(User.email == "patient@demo.com")
    if existing:
        from app.seed.extra_dummy_data import seed_extra_dummy_data

        await seed_extra_dummy_data()
        return

    password = hash_password("demo123")

    patient = await User(
        email="patient@demo.com",
        hashed_password=password,
        name="John Patient",
        role=UserRole.PATIENT,
        phone="+1234567890",
        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        patient_profile=PatientProfileEmbed(
            blood_group="B+",
            allergies=["Penicillin"],
            emergency_contact="+1234567890",
            date_of_birth="1988-03-10",
        ),
    ).insert()

    doctor = await User(
        email="doctor@demo.com",
        hashed_password=password,
        name="Dr. Sarah Wilson",
        role=UserRole.DOCTOR,
        phone="+1234567891",
        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        doctor_profile=DoctorProfileEmbed(
            specialization="Cardiology",
            experience=15,
            fees=500,
            rating=4.8,
            reviews=234,
            availability_days=["Monday", "Tuesday", "Wednesday", "Friday"],
            availability_slots=["09:00", "10:00", "11:00", "14:00"],
            location="New York, NY",
            qualifications=["MBBS", "MD Cardiology"],
        ),
    ).insert()

    admin = await User(
        email="admin@demo.com",
        hashed_password=password,
        name="Admin User",
        role=UserRole.ADMIN,
        phone="+1234567892",
        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    ).insert()

    pharmacist = await User(
        email="pharmacist@demo.com",
        hashed_password=password,
        name="Mike Pharmacist",
        role=UserRole.PHARMACIST,
        phone="+1234567893",
        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    ).insert()

    lab_tech = await User(
        email="lab@demo.com",
        hashed_password=password,
        name="Lab Technician",
        role=UserRole.LAB_TECH,
        phone="+1234567894",
        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Lab",
    ).insert()

    receptionist = await User(
        email="receptionist@demo.com",
        hashed_password=password,
        name="Emma Reception",
        role=UserRole.RECEPTIONIST,
        phone="+1234567895",
        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    ).insert()

    nurse = await User(
        email="nurse@demo.com",
        hashed_password=password,
        name="Lisa Nurse",
        role=UserRole.NURSE,
        phone="+1234567896",
        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    ).insert()

    supplier_user = await User(
        email="supplier@demo.com",
        hashed_password=password,
        name="Supply Co.",
        role=UserRole.SUPPLIER,
        phone="+1234567897",
        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Supply",
    ).insert()

    # Additional doctors for directory
    await User(
        email="michael.chen@hospital.com",
        hashed_password=password,
        name="Dr. Michael Chen",
        role=UserRole.DOCTOR,
        doctor_profile=DoctorProfileEmbed(specialization="Neurology", experience=12, fees=600, rating=4.9, reviews=187, location="Los Angeles, CA"),
    ).insert()

    pending_doctor = await User(
        email="pending.doctor@hospital.com",
        hashed_password=password,
        name="Dr. Pending Review",
        role=UserRole.DOCTOR,
        is_active=False,
        doctor_profile=DoctorProfileEmbed(specialization="Radiology", onboarding_status=OnboardingStatus.PENDING),
    ).insert()

    # Appointments
    await Appointment(
        patient_id=patient.id,
        patient_name=patient.name,
        doctor_id=doctor.id,
        doctor_name=doctor.name,
        doctor_specialization="Cardiology",
        date="2024-02-15",
        time="10:00 AM",
        status=AppointmentStatus.SCHEDULED,
        reason="Regular checkup",
        appointment_type=AppointmentType.IN_PERSON,
        fees=500,
    ).insert()

    await Appointment(
        patient_id=patient.id,
        patient_name=patient.name,
        doctor_id=doctor.id,
        doctor_name=doctor.name,
        doctor_specialization="Cardiology",
        date="2024-02-12",
        time="02:00 PM",
        status=AppointmentStatus.COMPLETED,
        reason="Follow-up consultation",
        appointment_type=AppointmentType.VIDEO,
        fees=400,
    ).insert()

    # Prescriptions
    rx = await Prescription(
        patient_id=patient.id,
        doctor_id=doctor.id,
        date="2024-01-28",
        diagnosis="Tension headache",
        medicines=[
            MedicineItem(name="Ibuprofen 400mg", dosage="1 tablet", frequency="Twice daily", duration="5 days"),
            MedicineItem(name="Vitamin B Complex", dosage="1 capsule", frequency="Once daily", duration="30 days"),
        ],
        notes="Avoid stress",
    ).insert()

    # Lab reports
    await LabReport(
        patient_id=patient.id,
        test_name="Complete Blood Count (CBC)",
        date="2024-01-25",
        status=LabReportStatus.COMPLETED,
        results_summary="All values within normal range",
    ).insert()
    await LabReport(patient_id=patient.id, test_name="Lipid Profile", date="2024-02-10", status=LabReportStatus.IN_PROGRESS).insert()

    # Pharmacy orders
    ord1 = await PharmacyOrder(
        patient_id=patient.id,
        medicines=[OrderMedicineItem(name="Ibuprofen 400mg", quantity=10, price=5)],
        total=50,
        status=OrderStatus.DELIVERED,
        date="2024-01-29",
        address="123 Main St, New York, NY 10001",
    ).insert()

    # Inventory
    for inv in [
        ("Paracetamol 500mg", "PCM001", 5000, "2025-12-31", "PharmaCorp", 0.5),
        ("Ibuprofen 400mg", "IBU001", 3000, "2025-10-15", "MedSupply Inc", 0.8),
        ("Amoxicillin 500mg", "AMX001", 150, "2024-06-30", "PharmaCorp", 1.2),
    ]:
        await InventoryItem(
            medicine_name=inv[0],
            batch_number=inv[1],
            quantity=inv[2],
            expiry_date=inv[3],
            supplier=inv[4],
            price=inv[5],
        ).insert()

    await FulfillmentPrescription(
        rx_id="RX-001",
        prescription_id=rx.id,
        patient_id=patient.id,
        patient_name=patient.name,
        doctor_id=doctor.id,
        doctor_name=doctor.name,
        date="2024-01-28",
        medicines=["Ibuprofen 400mg", "Vitamin B Complex"],
        status=FulfillmentStatus.PENDING,
    ).insert()

    await PurchaseOrder(
        supplier="PharmaCorp",
        items=[PurchaseOrderItem(name="Paracetamol 500mg", quantity=1000, unit_price=0.5)],
        total=500,
        order_date="2024-02-01",
        expected_delivery="2024-02-08",
        status=PurchaseOrderStatus.ORDERED,
    ).insert()

    await ReturnRequest(
        order_id=ord1.id,
        patient_id=patient.id,
        patient_name=patient.name,
        medicines=["Ibuprofen 400mg"],
        amount=25,
        reason="Wrong dosage received",
        request_date="2024-02-05",
        status=ReturnStatus.PENDING,
    ).insert()

    await SupplierInfo(name="PharmaCorp", contact_email="orders@pharmacorp.com", contact_phone="+18005551234", address="100 Pharma Way", products_count=120).insert()

    # Beds
    beds_data = [
        ("101", BedType.ICU, BedStatus.OCCUPIED, "Jane Doe"),
        ("102", BedType.ICU, BedStatus.AVAILABLE, None),
        ("201", BedType.PRIVATE, BedStatus.OCCUPIED, "Bob Smith"),
        ("301", BedType.GENERAL, BedStatus.AVAILABLE, None),
    ]
    for room, btype, bstatus, pname in beds_data:
        await Bed(room_number=room, bed_type=btype, status=bstatus, patient_name=pname).insert()

    # Departments
    await Department(name="Cardiology", head="Dr. Sarah Wilson", staff_count=24, beds=40).insert()
    await Department(name="Pediatrics", head="Dr. Emily Rodriguez", staff_count=18, beds=30).insert()

    # Billing
    await Invoice(
        patient_id=patient.id,
        patient_name=patient.name,
        service="Cardiology Consultation",
        date="2024-02-01",
        amount=500,
        status=InvoiceStatus.PAID,
    ).insert()
    await Invoice(
        patient_id=patient.id,
        patient_name=patient.name,
        service="Lab - Lipid Profile",
        date="2024-02-10",
        amount=65,
        status=InvoiceStatus.PENDING,
    ).insert()

    # Notifications for patient
    for n in [
        ("calendar", "blue", "Appointment Confirmed", "Your appointment is confirmed.", "5 min ago", NotificationCategory.APPOINTMENT),
        ("fileText", "purple", "New Prescription", "A new prescription was added.", "1 hour ago", NotificationCategory.PRESCRIPTION),
        ("dollarSign", "red", "Invoice Due", "Invoice due in 3 days.", "2 days ago", NotificationCategory.BILLING),
    ]:
        await Notification(
            user_id=patient.id,
            icon=n[0],
            color=n[1],
            title=n[2],
            message=n[3],
            time_label=n[4],
            category=n[5],
        ).insert()

    # Audit log
    await AuditLogEntry(user_name=admin.name, role="admin", action="Created user", target="doctor@demo.com", category=AuditCategory.USER).insert()

    # Announcements
    await Announcement(title="System Maintenance", message="Scheduled maintenance Sunday 2 AM.", target_roles=["all"]).insert()

    # Family
    await FamilyMember(patient_id=patient.id, name="Jane Patient", relationship="Spouse", date_of_birth="1990-06-15", phone="+1234567800", blood_group="A+").insert()

    # Insurance
    await InsurancePolicy(
        patient_id=patient.id,
        plan_name="BlueCross Premier PPO",
        policy_number="BCX-2024-7894561",
        group_number="GRP-HMS-1024",
        member_id="MEM-JP-001234",
        provider="BlueCross Health",
        effective_date="2024-01-01",
        deductible=500,
        deductible_met=320,
        out_of_pocket_max=3000,
        out_of_pocket_used=890,
        member_services_phone="1-800-555-0199",
        coverage_items=[InsuranceCoverageItem(category="Primary Care", covered="100%", copay="$25", limit="Unlimited")],
    ).insert()

    # Lab catalog, samples, equipment
    await LabTestCatalog(name="Complete Blood Count (CBC)", category="Hematology", price=45, turnaround="4 hrs", sample_type="Blood").insert()
    await LabSample(
        sample_id="SMP-2024-0841",
        patient_id=patient.id,
        patient_name=patient.name,
        test_name="Complete Blood Count (CBC)",
        collected_at="2024-02-15 09:15",
        status=SampleStatus.PROCESSING,
        location="Hematology Lab",
    ).insert()
    await LabEquipment(
        name="Automated Hematology Analyzer",
        model="Sysmex XN-1000",
        location="Hematology Lab",
        last_calibration="2024-01-15",
        next_calibration="2024-04-15",
        status=EquipmentStatus.OPERATIONAL,
        qc_score=98,
    ).insert()
    await LabCollectionAppointment(patient_id=patient.id, patient_name=patient.name, test_name="Lipid Profile", date="2024-02-16", time="09:00 AM").insert()

    # Referrals & notes
    await Referral(
        patient_id=patient.id,
        patient_name=patient.name,
        doctor_id=doctor.id,
        specialist="Dr. James Cardio",
        specialty="Cardiology",
        reason="Follow-up ECG",
        urgency=ReferralUrgency.ROUTINE,
        status=ReferralStatus.PENDING,
        date="2024-02-01",
    ).insert()
    await MedicalNote(patient_id=patient.id, doctor_id=doctor.id, title="Initial Consultation", content="Patient stable.", vitals={"hr": 72, "bp": "120/80"}).insert()

    # Messages
    await MessageThread(
        doctor_id=doctor.id,
        patient_id=patient.id,
        patient_name=patient.name,
        last_message="Thank you doctor",
        last_time="10:30 AM",
        messages=[ChatMessage(sender="patient", text="Hello doctor", time="10:00 AM"), ChatMessage(sender="doctor", text="How can I help?", time="10:15 AM")],
    ).insert()

    # Nurse tasks
    await NurseTask(patient_name="Jane Doe", room="101", task_type=NurseTaskType.MEDICATION, description="Administer morning meds", scheduled="08:00 AM").insert()

    # Supplier products
    await SupplierProduct(
        supplier_id=supplier_user.id,
        name="Paracetamol 500mg",
        category="Pain Relief",
        sku="PCM-500",
        stock=5000,
        unit_price=0.5,
        status=ProductStatus.IN_STOCK,
    ).insert()
    await SupplierOrder(supplier_id=supplier_user.id, items=[{"name": "Paracetamol", "qty": 100}], total=50, order_date="2024-02-01").insert()

    _ = (admin, pharmacist, lab_tech, receptionist, nurse, pending_doctor)

    from app.seed.extra_dummy_data import seed_extra_dummy_data

    await seed_extra_dummy_data()
