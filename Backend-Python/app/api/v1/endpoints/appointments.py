from typing import List, Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, Query, status

from app.core.dependencies import CurrentUser, PatientOrReceptionistUser
from app.core.enums import AppointmentStatus
from app.schemas.appointments import AppointmentCreate, AppointmentOut, AppointmentUpdate
from app.schemas.common import MessageResponse
from app.services import appointments as appointments_service

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.get("", response_model=List[AppointmentOut])
async def list_appointments(
    current_user: CurrentUser,
    status_filter: Optional[AppointmentStatus] = Query(None, alias="status"),
) -> List[AppointmentOut]:
    return await appointments_service.list_appointments(current_user, status_filter)


@router.post("", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
async def book_appointment(
    body: AppointmentCreate,
    current_user: PatientOrReceptionistUser,
) -> AppointmentOut:
    return await appointments_service.book_appointment(body, current_user)


@router.get("/{appointment_id}", response_model=AppointmentOut)
async def get_appointment(appointment_id: PydanticObjectId, current_user: CurrentUser) -> AppointmentOut:
    return await appointments_service.get_appointment(appointment_id, current_user)


@router.patch("/{appointment_id}", response_model=AppointmentOut)
async def update_appointment(
    appointment_id: PydanticObjectId,
    body: AppointmentUpdate,
    current_user: CurrentUser,
) -> AppointmentOut:
    return await appointments_service.update_appointment(appointment_id, body, current_user)


@router.delete("/{appointment_id}", response_model=MessageResponse)
async def cancel_appointment(appointment_id: PydanticObjectId, current_user: CurrentUser) -> MessageResponse:
    message = await appointments_service.cancel_appointment(appointment_id)
    return MessageResponse(message=message)
