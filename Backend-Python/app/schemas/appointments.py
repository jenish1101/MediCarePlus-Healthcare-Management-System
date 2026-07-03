from typing import Optional

from beanie import PydanticObjectId
from pydantic import BaseModel, Field

from app.core.enums import AppointmentStatus, AppointmentType
from app.schemas.common import ORMModel


class AppointmentCreate(BaseModel):
    doctor_id: PydanticObjectId
    date: str
    time: str
    reason: str
    appointment_type: AppointmentType = AppointmentType.IN_PERSON
    patient_id: Optional[PydanticObjectId] = None


class AppointmentUpdate(BaseModel):
    date: Optional[str] = None
    time: Optional[str] = None
    status: Optional[AppointmentStatus] = None
    reason: Optional[str] = None
    appointment_type: Optional[AppointmentType] = None


class AppointmentOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    patient_name: str
    doctor_id: PydanticObjectId
    doctor_name: str
    doctor_specialization: str
    date: str
    time: str
    status: AppointmentStatus
    reason: str
    appointment_type: AppointmentType
    fees: float
