from typing import List, Optional

from beanie import PydanticObjectId
from pydantic import BaseModel, Field

from app.core.enums import (
    AnnouncementStatus,
    AuditCategory,
    BedStatus,
    BedType,
    DepartmentStatus,
    InvoiceStatus,
    NurseTaskStatus,
    NurseTaskType,
    OnboardingStatus,
    ProductStatus,
)
from app.schemas.common import ORMModel


class BedOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    room_number: str
    bed_type: BedType
    status: BedStatus
    patient_id: Optional[PydanticObjectId] = None
    patient_name: Optional[str] = None


class BedUpdate(BaseModel):
    status: Optional[BedStatus] = None
    patient_id: Optional[PydanticObjectId] = None
    patient_name: Optional[str] = None


class DepartmentOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    name: str
    head: str
    staff_count: int
    beds: int
    status: DepartmentStatus


class DepartmentCreate(BaseModel):
    name: str
    head: str
    staff_count: int = 0
    beds: int = 0
    status: DepartmentStatus = DepartmentStatus.ACTIVE


class InvoiceOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    patient_name: str
    service: str
    date: str
    amount: float
    status: InvoiceStatus


class AuditOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    user_name: str
    role: str
    action: str
    target: str
    timestamp: str
    category: AuditCategory


class AnnouncementCreate(BaseModel):
    title: str
    message: str
    target_roles: List[str]


class AnnouncementOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    title: str
    message: str
    target_roles: List[str]
    created_at: str
    status: AnnouncementStatus


class OnboardingOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    name: str
    email: str
    specialization: str
    onboarding_status: OnboardingStatus


class NotificationOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    icon: str
    color: str
    title: str
    message: str
    time_label: str
    unread: bool
    category: Optional[str] = None


class NurseTaskOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_name: str
    room: str
    task_type: NurseTaskType
    description: str
    scheduled: str
    status: NurseTaskStatus


class ProductOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    name: str
    category: str
    sku: str
    stock: int
    unit_price: float
    status: ProductStatus


class SupplierOrderOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    total: float
    status: str
    order_date: str
    items: list
