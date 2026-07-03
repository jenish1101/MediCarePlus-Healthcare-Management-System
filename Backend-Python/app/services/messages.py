from datetime import datetime, timezone
from typing import List

from beanie import PydanticObjectId
from pydantic import BaseModel, Field

from app.core.exceptions import NotFoundError
from app.models.messaging import ChatMessage, MessageThread
from app.models.user import User


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


async def list_threads(doctor: User) -> List[ThreadOut]:
    items = await MessageThread.find(MessageThread.doctor_id == doctor.id).to_list()
    return [ThreadOut(_id=t.id, **t.model_dump(exclude={"id", "doctor_id", "updated_at"})) for t in items]


async def send_message(thread_id: PydanticObjectId, body: SendMessage, doctor: User) -> ThreadOut:
    thread = await MessageThread.get(thread_id)
    if not thread or thread.doctor_id != doctor.id:
        raise NotFoundError("Thread not found")
    now = datetime.now(timezone.utc).strftime("%I:%M %p")
    msg = ChatMessage(sender="doctor", text=body.text, time=now)
    thread.messages.append(msg)
    thread.last_message = body.text
    thread.last_time = now
    thread.updated_at = datetime.now(timezone.utc)
    await thread.save()
    return ThreadOut(_id=thread.id, **thread.model_dump(exclude={"id", "doctor_id", "updated_at"}))
