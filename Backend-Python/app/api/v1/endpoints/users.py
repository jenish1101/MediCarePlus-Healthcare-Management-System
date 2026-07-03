from typing import List, Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, Query, status

from app.core.dependencies import AdminUser, CurrentUser, PatientListUser
from app.core.enums import UserRole
from app.schemas.common import MessageResponse, UserCreateRequest, UserPublic, UserUpdateRequest
from app.schemas.users import PatientSummary
from app.services import users as users_service

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/patients", response_model=List[PatientSummary])
async def list_patients(
    current_user: PatientListUser,
    search: Optional[str] = Query(None),
) -> List[PatientSummary]:
    return await users_service.list_patients(current_user, search)


@router.get("", response_model=List[UserPublic])
async def list_users(
    _: AdminUser,
    role: Optional[UserRole] = Query(None),
    search: Optional[str] = Query(None),
) -> List[UserPublic]:
    return await users_service.list_users(role=role, search=search)


@router.post("", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def create_user(body: UserCreateRequest, admin: AdminUser) -> UserPublic:
    return await users_service.create_user(body, admin)


@router.get("/{user_id}", response_model=UserPublic)
async def get_user(user_id: PydanticObjectId, _: AdminUser) -> UserPublic:
    return await users_service.get_user(user_id)


@router.patch("/{user_id}", response_model=UserPublic)
async def update_user(user_id: PydanticObjectId, body: UserUpdateRequest, admin: AdminUser) -> UserPublic:
    return await users_service.update_user(user_id, body, admin)


@router.delete("/{user_id}", response_model=MessageResponse)
async def delete_user(user_id: PydanticObjectId, admin: AdminUser) -> MessageResponse:
    await users_service.delete_user(user_id, admin)
    return MessageResponse(message="User deleted")


@router.patch("/me/profile", response_model=UserPublic)
async def update_my_profile(body: UserUpdateRequest, current_user: CurrentUser) -> UserPublic:
    return await users_service.update_my_profile(current_user, body)
