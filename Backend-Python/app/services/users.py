from beanie import PydanticObjectId

from app.models.user import User
from app.schemas.common import UserPublic


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
