from beanie import PydanticObjectId

from app.core.enums import UserRole
from app.core.exceptions import ConflictError, ForbiddenError, UnauthorizedError
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.user import PatientProfileEmbed, User
from app.schemas.common import LoginRequest, RefreshRequest, SignupRequest, TokenResponse


def _token_response_for_user(user: User) -> TokenResponse:
    subject = str(user.id)
    return TokenResponse(
        access_token=create_access_token(subject, {"role": user.role}),
        refresh_token=create_refresh_token(subject),
    )


async def login(body: LoginRequest) -> TokenResponse:
    user = await User.find_one(User.email == body.email)
    if user is None or not verify_password(body.password, user.hashed_password):
        raise UnauthorizedError("Invalid credentials")
    if user.role != body.role:
        raise UnauthorizedError("Role mismatch for this account")
    if not user.is_active:
        raise ForbiddenError("Account is inactive")
    return _token_response_for_user(user)


async def signup(body: SignupRequest) -> TokenResponse:
    existing = await User.find_one(User.email == body.email)
    if existing:
        raise ConflictError("Email already registered")
    user = User(
        email=body.email,
        hashed_password=hash_password(body.password),
        name=body.name,
        role=UserRole.PATIENT,
        phone=body.phone,
        avatar=f"https://api.dicebear.com/7.x/avataaars/svg?seed={body.name}",
        patient_profile=PatientProfileEmbed(),
    )
    await user.insert()
    return _token_response_for_user(user)


async def refresh_token(body: RefreshRequest) -> TokenResponse:
    try:
        payload = decode_token(body.refresh_token)
    except ValueError as exc:
        raise UnauthorizedError("Invalid refresh token") from exc
    if payload.get("type") != "refresh":
        raise UnauthorizedError("Invalid token type")
    user = await User.get(PydanticObjectId(payload["sub"]))
    if user is None or not user.is_active:
        raise UnauthorizedError("User not found")
    return _token_response_for_user(user)
