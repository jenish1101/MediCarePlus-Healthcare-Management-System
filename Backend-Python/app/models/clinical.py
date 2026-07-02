from datetime import datetime, timezone
from typing import List, Optional

from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field

from app.core.enums import (
    AppointmentStatus,
    AppointmentType,
    ReferralStatus,
    ReferralUrgency,
)


class MedicineItem(BaseModel):
    name: str
    dosage: str
    frequency: str
    duration: str
    instructions: Optional[str] = None


class Appointment(Document):
    patient_id: PydanticObjectId
    patient_name: str
    doctor_id: PydanticObjectId
    doctor_name: str
    doctor_specialization: str
    date: str
    time: str
    status: AppointmentStatus = AppointmentStatus.SCHEDULED
    reason: str
    appointment_type: AppointmentType = AppointmentType.IN_PERSON
    fees: float = 0

    class Settings:
        name = "appointments"


class Prescription(Document):
    patient_id: PydanticObjectId
    doctor_id: PydanticObjectId
    date: str
    medicines: List[MedicineItem] = Field(default_factory=list)
    diagnosis: str
    notes: Optional[str] = None

    class Settings:
        name = "prescriptions"


class MedicalNote(Document):
    patient_id: PydanticObjectId
    doctor_id: PydanticObjectId
    appointment_id: Optional[PydanticObjectId] = None
    title: str
    content: str
    vitals: Optional[dict] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "medical_notes"


class Referral(Document):
    patient_id: PydanticObjectId
    patient_name: str
    doctor_id: PydanticObjectId
    specialist: str
    specialty: str
    reason: str
    urgency: ReferralUrgency = ReferralUrgency.ROUTINE
    status: ReferralStatus = ReferralStatus.PENDING
    date: str

    class Settings:
        name = "referrals"
