from fastapi import APIRouter

from app.api.v1.endpoints import (
    admin_ops,
    appointments,
    auth,
    clinical,
    lab,
    messages,
    pharmacy,
    users,
)

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(appointments.router)
api_router.include_router(clinical.router)
api_router.include_router(lab.router)
api_router.include_router(pharmacy.router)
api_router.include_router(admin_ops.router)
api_router.include_router(messages.router)
