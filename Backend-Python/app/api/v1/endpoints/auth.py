from fastapi import APIRouter, status

from app.core.dependencies import CurrentUser
from app.schemas.common import LoginRequest, MessageResponse, RefreshRequest, SignupRequest, TokenResponse, UserPublic
from app.services import auth as auth_service
from app.services.users import user_to_public

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest) -> TokenResponse:
    return await auth_service.login(body)


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(body: SignupRequest) -> TokenResponse:
    return await auth_service.signup(body)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(body: RefreshRequest) -> TokenResponse:
    return await auth_service.refresh_token(body)


@router.get("/me", response_model=UserPublic)
async def me(current_user: CurrentUser) -> UserPublic:
    return user_to_public(current_user)


@router.post("/logout", response_model=MessageResponse)
async def logout(_: CurrentUser) -> MessageResponse:
    return MessageResponse(message="Logged out successfully")
