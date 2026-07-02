from datetime import datetime, timezone
from typing import List, Literal, Optional

from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    sender: Literal["doctor", "patient"]
    text: str
    time: str


class MessageThread(Document):
    doctor_id: PydanticObjectId
    patient_id: PydanticObjectId
    patient_name: str
    last_message: str
    last_time: str
    unread_for_doctor: int = 0
    unread_for_patient: int = 0
    messages: List[ChatMessage] = Field(default_factory=list)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "message_threads"
