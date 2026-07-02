from typing import List, Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from app.core.dependencies import CurrentUser, require_roles
from app.core.enums import UserRole
from app.core.security import hash_password
from app.models.user import User
from app.schemas.common import MessageResponse, UserCreateRequest, UserPublic, UserUpdateRequest
from app.services.audit import log_audit
from app.services.users import user_to_public

router = APIRouter(prefix="/users", tags=["Users"])


class PatientSummary(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    name: str
    email: str
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    blood_group: Optional[str] = None
    last_visit: Optional[str] = None

    model_config = {"populate_by_name": True}


@router.get("/patients", response_model=List[PatientSummary])
async def list_patients(
    search: Optional[str] = Query(None),
    current_user: User = Depends(require_roles(UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.ADMIN)),
) -> List[PatientSummary]:
    from app.models.clinical import Appointment

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


@router.get("", response_model=List[UserPublic])
async def list_users(
    _: User = Depends(require_roles(UserRole.ADMIN)),
    role: Optional[UserRole] = Query(None),
    search: Optional[str] = Query(None),
) -> List[UserPublic]:
    query = {}
    if role:
        query["role"] = role
    users = await User.find(query).to_list()
    if search:
        s = search.lower()
        users = [u for u in users if s in u.name.lower() or s in u.email.lower()]
    return [user_to_public(u) for u in users]


@router.post("", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def create_user(
    body: UserCreateRequest,
    admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> UserPublic:
    if await User.find_one(User.email == body.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email exists")
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


@router.get("/{user_id}", response_model=UserPublic)
async def get_user(
    user_id: PydanticObjectId,
    _: User = Depends(require_roles(UserRole.ADMIN)),
) -> UserPublic:
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user_to_public(user)


@router.patch("/{user_id}", response_model=UserPublic)
async def update_user(
    user_id: PydanticObjectId,
    body: UserUpdateRequest,
    admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> UserPublic:
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    data = body.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(user, key, value)
    await user.save()
    await log_audit(user_name=admin.name, role=admin.role, action="Updated user", target=user.email)
    return user_to_public(user)


@router.delete("/{user_id}", response_model=MessageResponse)
async def delete_user(
    user_id: PydanticObjectId,
    admin: User = Depends(require_roles(UserRole.ADMIN)),
) -> MessageResponse:
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await user.delete()
    await log_audit(user_name=admin.name, role=admin.role, action="Deleted user", target=user.email)
    return MessageResponse(message="User deleted")


@router.patch("/me/profile", response_model=UserPublic)
async def update_my_profile(body: UserUpdateRequest, current_user: CurrentUser) -> UserPublic:
    data = body.model_dump(exclude_unset=True)
    for key, value in data.items():
        if key == "is_active":
            continue
        setattr(current_user, key, value)
    await current_user.save()
    return user_to_public(current_user)
