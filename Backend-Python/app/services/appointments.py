from typing import List, Optional

from beanie import PydanticObjectId

from app.core.enums import AppointmentStatus, UserRole
from app.core.exceptions import BadRequestError, ForbiddenError, NotFoundError
from app.core.utils import get_or_404
from app.models.clinical import Appointment
from app.models.user import User
from app.schemas.appointments import AppointmentCreate, AppointmentOut, AppointmentUpdate


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


async def list_appointments(
    current_user: User,
    status_filter: Optional[AppointmentStatus] = None,
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


async def book_appointment(body: AppointmentCreate, current_user: User) -> AppointmentOut:
    doctor = await User.get(body.doctor_id)
    if not doctor or doctor.role != UserRole.DOCTOR:
        raise NotFoundError("Doctor not found")
    if current_user.role == UserRole.RECEPTIONIST:
        if not body.patient_id:
            raise BadRequestError("patient_id is required for receptionist booking")
        patient = await User.get(body.patient_id)
        if not patient or patient.role != UserRole.PATIENT:
            raise NotFoundError("Patient not found")
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


async def get_appointment(appointment_id: PydanticObjectId, current_user: User) -> AppointmentOut:
    apt = await get_or_404(Appointment, appointment_id, "Appointment not found")
    if current_user.role == UserRole.PATIENT and apt.patient_id != current_user.id:
        raise ForbiddenError("Forbidden")
    if current_user.role == UserRole.DOCTOR and apt.doctor_id != current_user.id:
        raise ForbiddenError("Forbidden")
    return _to_out(apt)


async def update_appointment(
    appointment_id: PydanticObjectId,
    body: AppointmentUpdate,
    current_user: User,
) -> AppointmentOut:
    apt = await get_or_404(Appointment, appointment_id, "Appointment not found")
    allowed = {UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.PATIENT}
    if current_user.role not in allowed:
        raise ForbiddenError("Forbidden")
    if current_user.role == UserRole.PATIENT and apt.patient_id != current_user.id:
        raise ForbiddenError("Forbidden")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(apt, key, value)
    await apt.save()
    return _to_out(apt)


async def cancel_appointment(appointment_id: PydanticObjectId) -> str:
    apt = await get_or_404(Appointment, appointment_id, "Appointment not found")
    apt.status = AppointmentStatus.CANCELLED
    await apt.save()
    return "Appointment cancelled"
