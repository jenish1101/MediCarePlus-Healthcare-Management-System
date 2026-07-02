from datetime import datetime
from typing import Generic, List, Optional, TypeVar

from beanie import PydanticObjectId
from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.core.enums import UserRole
from app.models.user import DoctorProfileEmbed, PatientProfileEmbed

T = TypeVar("T")


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class MessageResponse(ORMModel):
    message: str


class PaginatedResponse(ORMModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int


class TokenResponse(ORMModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserPublic(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    email: EmailStr
    name: str
    role: UserRole
    phone: Optional[str] = None
    avatar: Optional[str] = None
    is_active: bool = True
    patient_profile: Optional[PatientProfileEmbed] = None
    doctor_profile: Optional[DoctorProfileEmbed] = None
    created_at: datetime


class LoginRequest(ORMModel):
    email: EmailStr
    password: str
    role: UserRole


class SignupRequest(ORMModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None


class RefreshRequest(ORMModel):
    refresh_token: str


class UserCreateRequest(ORMModel):
    email: EmailStr
    password: str
    name: str
    role: UserRole
    phone: Optional[str] = None
    patient_profile: Optional[PatientProfileEmbed] = None
    doctor_profile: Optional[DoctorProfileEmbed] = None


class UserUpdateRequest(ORMModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None
    is_active: Optional[bool] = None
    patient_profile: Optional[PatientProfileEmbed] = None
    doctor_profile: Optional[DoctorProfileEmbed] = None
