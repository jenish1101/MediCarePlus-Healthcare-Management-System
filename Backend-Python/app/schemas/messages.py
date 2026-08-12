from typing import List

from beanie import PydanticObjectId
from pydantic import BaseModel, Field

from app.models.messaging import ChatMessage
from app.schemas.common import ORMModel


class ThreadOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    patient_name: str
    last_message: str
    last_time: str
    unread_for_doctor: int
    unread_for_patient: int
    messages: List[ChatMessage]


class SendMessage(BaseModel):
    text: str
