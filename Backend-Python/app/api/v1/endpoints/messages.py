from datetime import datetime, timezone
from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.core.dependencies import require_roles
from app.core.enums import UserRole
from app.models.messaging import ChatMessage, MessageThread
from app.models.user import User
from app.schemas.common import MessageResponse

router = APIRouter(prefix="/messages", tags=["Messages"])


class ThreadOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    patient_name: str
    last_message: str
    last_time: str
    unread_for_doctor: int
    unread_for_patient: int
    messages: List[ChatMessage]

    model_config = {"populate_by_name": True}


class SendMessage(BaseModel):
    text: str


@router.get("", response_model=List[ThreadOut])
async def list_threads(doctor: User = Depends(require_roles(UserRole.DOCTOR))) -> List[ThreadOut]:
    items = await MessageThread.find(MessageThread.doctor_id == doctor.id).to_list()
    return [ThreadOut(_id=t.id, **t.model_dump(exclude={"id", "doctor_id", "updated_at"})) for t in items]


@router.post("/{thread_id}", response_model=ThreadOut)
async def send_message(
    thread_id: PydanticObjectId,
    body: SendMessage,
    doctor: User = Depends(require_roles(UserRole.DOCTOR)),
) -> ThreadOut:
    thread = await MessageThread.get(thread_id)
    if not thread or thread.doctor_id != doctor.id:
        raise HTTPException(status_code=404, detail="Thread not found")
    now = datetime.now(timezone.utc).strftime("%I:%M %p")
    msg = ChatMessage(sender="doctor", text=body.text, time=now)
    thread.messages.append(msg)
    thread.last_message = body.text
    thread.last_time = now
    thread.updated_at = datetime.now(timezone.utc)
    await thread.save()
    return ThreadOut(_id=thread.id, **thread.model_dump(exclude={"id", "doctor_id", "updated_at"}))
