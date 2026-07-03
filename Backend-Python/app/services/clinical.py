from collections import defaultdict
from datetime import date
from typing import List, Optional

from beanie import PydanticObjectId
from pydantic import BaseModel, Field

from app.core.enums import AppointmentStatus, ReferralUrgency, UserRole
from app.core.exceptions import NotFoundError
from app.models.clinical import Appointment, MedicalNote, Prescription, Referral
from app.models.clinical import MedicineItem as MedicineModel
from app.models.lab import LabReport
from app.models.user import FamilyMember, InsurancePolicy, User


class DoctorOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    name: str
    email: str
    specialization: str
    experience: int
    fees: float
    rating: float
    reviews: int
    availability_days: List[str]
    location: str
    qualifications: List[str]
    avatar: Optional[str] = None
    phone: Optional[str] = None

    model_config = {"populate_by_name": True}


class PrescriptionCreate(BaseModel):
    patient_id: PydanticObjectId
    diagnosis: str
    medicines: List[MedicineModel]
    notes: Optional[str] = None
    date: Optional[str] = None


class PrescriptionOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    doctor_id: PydanticObjectId
    date: str
    medicines: List[MedicineModel]
    diagnosis: str
    notes: Optional[str] = None

    model_config = {"populate_by_name": True}


class NoteCreate(BaseModel):
    patient_id: PydanticObjectId
    title: str
    content: str
    appointment_id: Optional[PydanticObjectId] = None
    vitals: Optional[dict] = None


class NoteOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    doctor_id: PydanticObjectId
    appointment_id: Optional[PydanticObjectId]
    title: str
    content: str
    vitals: Optional[dict]
    created_at: str

    model_config = {"populate_by_name": True}


class ReferralCreate(BaseModel):
    patient_id: PydanticObjectId
    patient_name: str
    specialist: str
    specialty: str
    reason: str
    urgency: str = "routine"
    date: str


class ReferralOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    patient_name: str
    doctor_id: PydanticObjectId
    specialist: str
    specialty: str
    reason: str
    urgency: str
    status: str
    date: str

    model_config = {"populate_by_name": True}


class FamilyMemberCreate(BaseModel):
    name: str
    relationship: str
    date_of_birth: str
    phone: str
    blood_group: str


class FamilyMemberOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    name: str
    relationship: str
    date_of_birth: str
    phone: str
    blood_group: str

    model_config = {"populate_by_name": True}


class InsuranceOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    plan_name: str
    policy_number: str
    group_number: str
    member_id: str
    provider: str
    effective_date: str
    deductible: float
    deductible_met: float
    out_of_pocket_max: float
    out_of_pocket_used: float
    member_services_phone: str
    coverage_items: list

    model_config = {"populate_by_name": True}


class AvailabilityOut(BaseModel):
    availability_days: List[str]
    availability_slots: List[str]


class AvailabilityUpdate(BaseModel):
    availability_days: List[str]
    availability_slots: List[str]


class EarningsTransaction(BaseModel):
    id: str
    patient_name: str
    date: str
    appointment_type: str
    amount: float


class EarningsSummary(BaseModel):
    total_earnings: float
    this_month: float
    pending_payout: float
    avg_per_consult: float
    monthly: List[dict]
    transactions: List[EarningsTransaction]


class TimelineEvent(BaseModel):
    id: str
    type: str
    title: str
    description: str
    date: str
    status: Optional[str] = None


async def list_doctors(
    search: Optional[str] = None,
    specialization: Optional[str] = None,
) -> List[DoctorOut]:
    doctors = await User.find(User.role == UserRole.DOCTOR, User.is_active == True).to_list()
    result = []
    for d in doctors:
        p = d.doctor_profile
        if not p:
            continue
        if specialization and p.specialization != specialization:
            continue
        if search and search.lower() not in d.name.lower() and search.lower() not in p.specialization.lower():
            continue
        result.append(
            DoctorOut(
                _id=d.id,
                name=d.name,
                email=d.email,
                specialization=p.specialization,
                experience=p.experience,
                fees=p.fees,
                rating=p.rating,
                reviews=p.reviews,
                availability_days=p.availability_days,
                location=p.location,
                qualifications=p.qualifications,
                avatar=d.avatar,
                phone=d.phone,
            )
        )
    return result


async def list_prescriptions(current_user: User) -> List[PrescriptionOut]:
    if current_user.role == UserRole.PATIENT:
        items = await Prescription.find(Prescription.patient_id == current_user.id).to_list()
    elif current_user.role == UserRole.DOCTOR:
        items = await Prescription.find(Prescription.doctor_id == current_user.id).to_list()
    else:
        items = await Prescription.find_all().to_list()
    return [PrescriptionOut(_id=i.id, **i.model_dump(exclude={"id"})) for i in items]


async def create_prescription(body: PrescriptionCreate, doctor: User) -> PrescriptionOut:
    rx = Prescription(
        patient_id=body.patient_id,
        doctor_id=doctor.id,
        date=body.date or str(date.today()),
        medicines=body.medicines,
        diagnosis=body.diagnosis,
        notes=body.notes,
    )
    await rx.insert()
    return PrescriptionOut(_id=rx.id, **rx.model_dump(exclude={"id"}))


async def list_notes(
    doctor: User,
    patient_id: Optional[PydanticObjectId] = None,
) -> List[NoteOut]:
    query = MedicalNote.find()
    if patient_id:
        query = MedicalNote.find(MedicalNote.patient_id == patient_id)
    elif doctor.role == UserRole.DOCTOR:
        query = MedicalNote.find(MedicalNote.doctor_id == doctor.id)
    items = await query.to_list()
    return [
        NoteOut(_id=n.id, created_at=n.created_at.isoformat(), **n.model_dump(exclude={"id", "created_at"}))
        for n in items
    ]


async def create_note(body: NoteCreate, doctor: User) -> NoteOut:
    note = MedicalNote(
        patient_id=body.patient_id,
        doctor_id=doctor.id,
        appointment_id=body.appointment_id,
        title=body.title,
        content=body.content,
        vitals=body.vitals,
    )
    await note.insert()
    return NoteOut(_id=note.id, created_at=note.created_at.isoformat(), **note.model_dump(exclude={"id", "created_at"}))


async def list_referrals(doctor: User) -> List[ReferralOut]:
    items = await Referral.find(Referral.doctor_id == doctor.id).to_list()
    return [
        ReferralOut(
            _id=r.id,
            urgency=r.urgency.value,
            status=r.status.value,
            **r.model_dump(exclude={"id", "urgency", "status"}),
        )
        for r in items
    ]


async def create_referral(body: ReferralCreate, doctor: User) -> ReferralOut:
    ref = Referral(
        patient_id=body.patient_id,
        patient_name=body.patient_name,
        doctor_id=doctor.id,
        specialist=body.specialist,
        specialty=body.specialty,
        reason=body.reason,
        urgency=ReferralUrgency(body.urgency),
        date=body.date,
    )
    await ref.insert()
    return ReferralOut(
        _id=ref.id,
        urgency=ref.urgency.value,
        status=ref.status.value,
        **ref.model_dump(exclude={"id", "urgency", "status"}),
    )


async def list_family(patient: User) -> List[FamilyMemberOut]:
    items = await FamilyMember.find(FamilyMember.patient_id == patient.id).to_list()
    return [FamilyMemberOut(_id=m.id, **m.model_dump(exclude={"id"})) for m in items]


async def add_family(body: FamilyMemberCreate, patient: User) -> FamilyMemberOut:
    member = FamilyMember(patient_id=patient.id, **body.model_dump())
    await member.insert()
    return FamilyMemberOut(_id=member.id, **member.model_dump(exclude={"id"}))


async def remove_family(member_id: PydanticObjectId, patient: User) -> str:
    member = await FamilyMember.get(member_id)
    if not member or member.patient_id != patient.id:
        raise NotFoundError("Not found")
    await member.delete()
    return "Family member removed"


async def get_insurance(patient: User) -> Optional[InsuranceOut]:
    policy = await InsurancePolicy.find_one(InsurancePolicy.patient_id == patient.id)
    if not policy:
        return None
    return InsuranceOut(_id=policy.id, **policy.model_dump(exclude={"id", "patient_id"}))


async def get_my_availability(doctor: User) -> AvailabilityOut:
    profile = doctor.doctor_profile
    if not profile:
        raise NotFoundError("Doctor profile not found")
    return AvailabilityOut(
        availability_days=profile.availability_days,
        availability_slots=profile.availability_slots,
    )


async def update_my_availability(body: AvailabilityUpdate, doctor: User) -> AvailabilityOut:
    if not doctor.doctor_profile:
        raise NotFoundError("Doctor profile not found")
    doctor.doctor_profile.availability_days = body.availability_days
    doctor.doctor_profile.availability_slots = body.availability_slots
    await doctor.save()
    return AvailabilityOut(
        availability_days=doctor.doctor_profile.availability_days,
        availability_slots=doctor.doctor_profile.availability_slots,
    )


async def get_my_earnings(doctor: User) -> EarningsSummary:
    appointments = await Appointment.find(
        Appointment.doctor_id == doctor.id,
        Appointment.status == AppointmentStatus.COMPLETED,
    ).to_list()
    total = sum(a.fees for a in appointments)
    transactions = [
        EarningsTransaction(
            id=str(a.id),
            patient_name=a.patient_name,
            date=a.date,
            appointment_type=a.appointment_type.value,
            amount=a.fees,
        )
        for a in sorted(appointments, key=lambda x: x.date, reverse=True)[:20]
    ]
    monthly_map: dict[str, float] = defaultdict(float)
    for a in appointments:
        month_key = a.date[:7]
        monthly_map[month_key] += a.fees
    monthly = [{"month": k, "earnings": round(v, 2)} for k, v in sorted(monthly_map.items())[-6:]]
    this_month = monthly[-1]["earnings"] if monthly else 0
    avg = round(total / len(appointments), 2) if appointments else 0
    return EarningsSummary(
        total_earnings=round(total, 2),
        this_month=round(this_month, 2),
        pending_payout=round(total * 0.1, 2),
        avg_per_consult=avg,
        monthly=monthly,
        transactions=transactions,
    )


async def get_health_timeline(patient: User) -> List[TimelineEvent]:
    events: List[TimelineEvent] = []
    appointments = await Appointment.find(Appointment.patient_id == patient.id).to_list()
    for a in appointments:
        events.append(
            TimelineEvent(
                id=str(a.id),
                type="appointment",
                title=f"Appointment with {a.doctor_name}",
                description=a.reason,
                date=a.date,
                status=a.status.value,
            )
        )
    prescriptions = await Prescription.find(Prescription.patient_id == patient.id).to_list()
    for rx in prescriptions:
        events.append(
            TimelineEvent(
                id=str(rx.id),
                type="prescription",
                title=f"Prescription — {rx.diagnosis}",
                description=", ".join(m.name for m in rx.medicines[:3]),
                date=rx.date,
            )
        )
    reports = await LabReport.find(LabReport.patient_id == patient.id).to_list()
    for r in reports:
        events.append(
            TimelineEvent(
                id=str(r.id),
                type="lab",
                title=r.test_name,
                description=r.results_summary or "Lab test",
                date=r.date,
                status=r.status.value,
            )
        )
    events.sort(key=lambda e: e.date, reverse=True)
    return events
