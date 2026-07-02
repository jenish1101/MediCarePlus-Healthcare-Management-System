from typing import List, Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from app.core.dependencies import CurrentUser, require_roles
from app.core.enums import AppointmentStatus, AppointmentType, UserRole
from app.models.clinical import Appointment
from app.models.user import User
from app.schemas.common import MessageResponse

router = APIRouter(prefix="/appointments", tags=["Appointments"])


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


class AppointmentOut(BaseModel):
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

    model_config = {"from_attributes": True, "populate_by_name": True}


def _to_out(apt: Appointment) -> AppointmentOut:
    return AppointmentOut(
        _id=apt.id,
        patient_id=apt.patient_id,
        patient_name=apt.patient_name,
        doctor_id=apt.doctor_id,
        doctor_name=apt.doctor_name,
        doctor_specialization=apt.doctor_specialization,
        date=apt.date,
        time=apt.time,
        status=apt.status,
        reason=apt.reason,
        appointment_type=apt.appointment_type,
        fees=apt.fees,
    )


@router.get("", response_model=List[AppointmentOut])
async def list_appointments(
    current_user: CurrentUser,
    status_filter: Optional[AppointmentStatus] = Query(None, alias="status"),
) -> List[AppointmentOut]:
    if current_user.role == UserRole.PATIENT:
        query = Appointment.find(Appointment.patient_id == current_user.id)
    elif current_user.role == UserRole.DOCTOR:
        query = Appointment.find(Appointment.doctor_id == current_user.id)
    else:
        query = Appointment.find_all()
    if status_filter:
        query = query.find(Appointment.status == status_filter)
    items = await query.to_list()
    return [_to_out(a) for a in items]


@router.post("", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
async def book_appointment(
    body: AppointmentCreate,
    current_user: User = Depends(require_roles(UserRole.PATIENT, UserRole.RECEPTIONIST)),
) -> AppointmentOut:
    doctor = await User.get(body.doctor_id)
    if not doctor or doctor.role != UserRole.DOCTOR:
        raise HTTPException(status_code=404, detail="Doctor not found")
    if current_user.role == UserRole.RECEPTIONIST:
        if not body.patient_id:
            raise HTTPException(status_code=400, detail="patient_id is required for receptionist booking")
        patient = await User.get(body.patient_id)
        if not patient or patient.role != UserRole.PATIENT:
            raise HTTPException(status_code=404, detail="Patient not found")
        patient_id = patient.id
        patient_name = patient.name
    else:
        patient_id = current_user.id
        patient_name = current_user.name
    profile = doctor.doctor_profile
    apt = Appointment(
        patient_id=patient_id,
        patient_name=patient_name,
        doctor_id=doctor.id,
        doctor_name=doctor.name,
        doctor_specialization=profile.specialization if profile else "General",
        date=body.date,
        time=body.time,
        reason=body.reason,
        appointment_type=body.appointment_type,
        fees=profile.fees if profile else 0,
    )
    await apt.insert()
    return _to_out(apt)


@router.get("/{appointment_id}", response_model=AppointmentOut)
async def get_appointment(appointment_id: PydanticObjectId, current_user: CurrentUser) -> AppointmentOut:
    apt = await Appointment.get(appointment_id)
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if current_user.role == UserRole.PATIENT and apt.patient_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    if current_user.role == UserRole.DOCTOR and apt.doctor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return _to_out(apt)


@router.patch("/{appointment_id}", response_model=AppointmentOut)
async def update_appointment(
    appointment_id: PydanticObjectId,
    body: AppointmentUpdate,
    current_user: CurrentUser,
) -> AppointmentOut:
    apt = await Appointment.get(appointment_id)
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    allowed = {UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.PATIENT}
    if current_user.role not in allowed:
        raise HTTPException(status_code=403, detail="Forbidden")
    if current_user.role == UserRole.PATIENT and apt.patient_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(apt, key, value)
    await apt.save()
    return _to_out(apt)


@router.delete("/{appointment_id}", response_model=MessageResponse)
async def cancel_appointment(appointment_id: PydanticObjectId, current_user: CurrentUser) -> MessageResponse:
    apt = await Appointment.get(appointment_id)
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    apt.status = AppointmentStatus.CANCELLED
    await apt.save()
    return MessageResponse(message="Appointment cancelled")
