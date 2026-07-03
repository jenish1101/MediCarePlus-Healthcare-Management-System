from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter

from app.core.dependencies import DoctorUser
from app.schemas.messages import SendMessage, ThreadOut
from app.services import messages as messages_service

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("", response_model=List[ThreadOut])
async def list_threads(doctor: DoctorUser) -> List[ThreadOut]:
    return await messages_service.list_threads(doctor)


@router.post("/{thread_id}", response_model=ThreadOut)
async def send_message(thread_id: PydanticObjectId, body: SendMessage, doctor: DoctorUser) -> ThreadOut:
    return await messages_service.send_message(thread_id, body, doctor)
