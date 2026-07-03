from typing import Optional

from beanie import PydanticObjectId
from pydantic import Field

from app.schemas.common import ORMModel


class PatientSummary(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    name: str
    email: str
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    blood_group: Optional[str] = None
    last_visit: Optional[str] = None
