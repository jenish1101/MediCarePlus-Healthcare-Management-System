from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException, status

from app.core.dependencies import CurrentUser
from app.core.enums import UserRole
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.user import PatientProfileEmbed, User
from app.schemas.common import (
    LoginRequest,
    MessageResponse,
    RefreshRequest,
    SignupRequest,
    TokenResponse,
    UserPublic,
)
from app.services.users import user_to_public

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest) -> TokenResponse:
    user = await User.find_one(User.email == body.email)
    if user is None or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if user.role != body.role:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Role mismatch for this account")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive")
    subject = str(user.id)
    return TokenResponse(
        access_token=create_access_token(subject, {"role": user.role}),
        refresh_token=create_refresh_token(subject),
    )


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(body: SignupRequest) -> TokenResponse:
    existing = await User.find_one(User.email == body.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
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
    subject = str(user.id)
    return TokenResponse(
        access_token=create_access_token(subject, {"role": user.role}),
        refresh_token=create_refresh_token(subject),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(body: RefreshRequest) -> TokenResponse:
    try:
        payload = decode_token(body.refresh_token)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
    user = await User.get(PydanticObjectId(payload["sub"]))
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    subject = str(user.id)
    return TokenResponse(
        access_token=create_access_token(subject, {"role": user.role}),
        refresh_token=create_refresh_token(subject),
    )


@router.get("/me", response_model=UserPublic)
async def me(current_user: CurrentUser) -> UserPublic:
    return user_to_public(current_user)


@router.post("/logout", response_model=MessageResponse)
async def logout(_: CurrentUser) -> MessageResponse:
    return MessageResponse(message="Logged out successfully")
