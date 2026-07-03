from typing import List, Optional

from beanie import PydanticObjectId

from app.core.enums import UserRole
from app.core.exceptions import ConflictError
from app.core.security import hash_password
from app.core.utils import get_or_404
from app.models.clinical import Appointment
from app.models.user import User
from app.schemas.common import UserCreateRequest, UserPublic, UserUpdateRequest
from app.schemas.users import PatientSummary
from app.services.audit import log_audit

def user_to_public(user: User) -> UserPublic:
    return UserPublic(
        _id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        phone=user.phone,
        avatar=user.avatar,
        is_active=user.is_active,
        patient_profile=user.patient_profile,
        doctor_profile=user.doctor_profile,
        created_at=user.created_at,
    )


async def get_user_name(user_id: PydanticObjectId) -> str:
    user = await User.get(user_id)
    return user.name if user else "Unknown"


async def list_patients(
    current_user: User,
    search: Optional[str] = None,
) -> List[PatientSummary]:
    patients = await User.find(User.role == UserRole.PATIENT).to_list()
    if search:
        s = search.lower()
        patients = [p for p in patients if s in p.name.lower() or s in p.email.lower()]
    if current_user.role == UserRole.DOCTOR:
        appointments = await Appointment.find(Appointment.doctor_id == current_user.id).to_list()
        patient_ids = {a.patient_id for a in appointments}
        patients = [p for p in patients if p.id in patient_ids]
    result: List[PatientSummary] = []
    for p in patients:
        last_apt = await Appointment.find(Appointment.patient_id == p.id).sort("-date").first_or_none()
        profile = p.patient_profile
        result.append(
            PatientSummary(
                _id=p.id,
                name=p.name,
                email=p.email,
                phone=p.phone,
                date_of_birth=profile.date_of_birth if profile else None,
                blood_group=profile.blood_group if profile else None,
                last_visit=last_apt.date if last_apt else None,
            )
        )
    return result


async def list_users(
    role: Optional[UserRole] = None,
    search: Optional[str] = None,
) -> List[UserPublic]:
    query = {}
    if role:
        query["role"] = role
    users = await User.find(query).to_list()
    if search:
        s = search.lower()
        users = [u for u in users if s in u.name.lower() or s in u.email.lower()]
    return [user_to_public(u) for u in users]


async def create_user(body: UserCreateRequest, admin: User) -> UserPublic:
    if await User.find_one(User.email == body.email):
        raise ConflictError("Email exists")
    user = User(
        email=body.email,
        hashed_password=hash_password(body.password),
        name=body.name,
        role=body.role,
        phone=body.phone,
        patient_profile=body.patient_profile,
        doctor_profile=body.doctor_profile,
    )
    await user.insert()
    await log_audit(user_name=admin.name, role=admin.role, action="Created user", target=user.email)
    return user_to_public(user)


async def get_user(user_id: PydanticObjectId) -> UserPublic:
    user = await get_or_404(User, user_id, "User not found")
    return user_to_public(user)


async def update_user(user_id: PydanticObjectId, body: UserUpdateRequest, admin: User) -> UserPublic:
    user = await get_or_404(User, user_id, "User not found")
    data = body.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(user, key, value)
    await user.save()
    await log_audit(user_name=admin.name, role=admin.role, action="Updated user", target=user.email)
    return user_to_public(user)


async def delete_user(user_id: PydanticObjectId, admin: User) -> str:
    user = await get_or_404(User, user_id, "User not found")
    await user.delete()
    await log_audit(user_name=admin.name, role=admin.role, action="Deleted user", target=user.email)
    return "User deleted"


async def update_my_profile(current_user: User, body: UserUpdateRequest) -> UserPublic:
    data = body.model_dump(exclude_unset=True)
    for key, value in data.items():
        if key == "is_active":
            continue
        setattr(current_user, key, value)
    await current_user.save()
    return user_to_public(current_user)
