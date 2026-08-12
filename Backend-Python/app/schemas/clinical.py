from typing import List, Optional

from beanie import PydanticObjectId
from pydantic import BaseModel, Field

from app.models.clinical import MedicineItem as MedicineModel
from app.schemas.common import ORMModel


class DoctorOut(ORMModel):
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


class PrescriptionCreate(BaseModel):
    patient_id: PydanticObjectId
    diagnosis: str
    medicines: List[MedicineModel]
    notes: Optional[str] = None
    date: Optional[str] = None


class PrescriptionOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    doctor_id: PydanticObjectId
    date: str
    medicines: List[MedicineModel]
    diagnosis: str
    notes: Optional[str] = None


class NoteCreate(BaseModel):
    patient_id: PydanticObjectId
    title: str
    content: str
    appointment_id: Optional[PydanticObjectId] = None
    vitals: Optional[dict] = None


class NoteOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    doctor_id: PydanticObjectId
    appointment_id: Optional[PydanticObjectId]
    title: str
    content: str
    vitals: Optional[dict]
    created_at: str


class ReferralCreate(BaseModel):
    patient_id: PydanticObjectId
    patient_name: str
    specialist: str
    specialty: str
    reason: str
    urgency: str = "routine"
    date: str


class ReferralOut(ORMModel):
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


class FamilyMemberCreate(BaseModel):
    name: str
    relationship: str
    date_of_birth: str
    phone: str
    blood_group: str


class FamilyMemberOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    name: str
    relationship: str
    date_of_birth: str
    phone: str
    blood_group: str


class InsuranceOut(ORMModel):
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
