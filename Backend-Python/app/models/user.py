from datetime import datetime, timezone
from typing import List, Optional

from beanie import Document, Indexed, PydanticObjectId
from pydantic import BaseModel, EmailStr, Field

from app.core.enums import OnboardingStatus, UserRole


class PatientProfileEmbed(BaseModel):
    blood_group: Optional[str] = None
    allergies: List[str] = Field(default_factory=list)
    emergency_contact: Optional[str] = None
    insurance_info: Optional[str] = None
    medical_history: List[str] = Field(default_factory=list)
    date_of_birth: Optional[str] = None


class DoctorProfileEmbed(BaseModel):
    specialization: str = "General Medicine"
    experience: int = 0
    fees: float = 0
    rating: float = 0
    reviews: int = 0
    availability_days: List[str] = Field(default_factory=list)
    availability_slots: List[str] = Field(default_factory=list)
    location: str = ""
    qualifications: List[str] = Field(default_factory=list)
    onboarding_status: OnboardingStatus = OnboardingStatus.APPROVED


class User(Document):
    email: Indexed(EmailStr, unique=True)
    hashed_password: str
    name: str
    role: UserRole
    phone: Optional[str] = None
    avatar: Optional[str] = None
    is_active: bool = True
    patient_profile: Optional[PatientProfileEmbed] = None
    doctor_profile: Optional[DoctorProfileEmbed] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"


class FamilyMember(Document):
    patient_id: PydanticObjectId
    name: str
    relationship: str
    date_of_birth: str
    phone: str
    blood_group: str

    class Settings:
        name = "family_members"


class InsuranceCoverageItem(BaseModel):
    category: str
    covered: str
    copay: str
    limit: str
    status: str = "active"


class InsurancePolicy(Document):
    patient_id: PydanticObjectId
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
    coverage_items: List[InsuranceCoverageItem] = Field(default_factory=list)

    class Settings:
        name = "insurance_policies"
