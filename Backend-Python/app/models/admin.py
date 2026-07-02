from datetime import datetime, timezone
from typing import List, Optional

from beanie import Document, PydanticObjectId
from pydantic import Field

from app.core.enums import (
    AnnouncementStatus,
    AuditCategory,
    BedStatus,
    BedType,
    DepartmentStatus,
    InvoiceStatus,
    NotificationCategory,
    NurseTaskStatus,
    NurseTaskType,
    PaymentMethod,
    PaymentStatus,
    ProductStatus,
)


class Bed(Document):
    room_number: str
    bed_type: BedType
    status: BedStatus = BedStatus.AVAILABLE
    patient_id: Optional[PydanticObjectId] = None
    patient_name: Optional[str] = None

    class Settings:
        name = "beds"


class Department(Document):
    name: str
    head: str
    staff_count: int = 0
    beds: int = 0
    status: DepartmentStatus = DepartmentStatus.ACTIVE

    class Settings:
        name = "departments"


class Invoice(Document):
    patient_id: PydanticObjectId
    patient_name: str
    service: str
    date: str
    amount: float
    status: InvoiceStatus = InvoiceStatus.PENDING

    class Settings:
        name = "invoices"


class Payment(Document):
    patient_id: PydanticObjectId
    invoice_id: Optional[PydanticObjectId] = None
    amount: float
    date: str
    status: PaymentStatus = PaymentStatus.PENDING
    method: PaymentMethod = PaymentMethod.CARD
    description: str

    class Settings:
        name = "payments"


class Notification(Document):
    user_id: PydanticObjectId
    icon: str = "bell"
    color: str = "blue"
    title: str
    message: str
    time_label: str
    unread: bool = True
    category: Optional[NotificationCategory] = None

    class Settings:
        name = "notifications"


class AuditLogEntry(Document):
    user_name: str
    role: str
    action: str
    target: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    category: AuditCategory = AuditCategory.USER

    class Settings:
        name = "audit_logs"


class Announcement(Document):
    title: str
    message: str
    target_roles: List[str] = Field(default_factory=lambda: ["all"])
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: AnnouncementStatus = AnnouncementStatus.ACTIVE

    class Settings:
        name = "announcements"


class NurseTask(Document):
    patient_name: str
    room: str
    task_type: NurseTaskType
    description: str
    scheduled: str
    status: NurseTaskStatus = NurseTaskStatus.PENDING
    nurse_id: Optional[PydanticObjectId] = None

    class Settings:
        name = "nurse_tasks"


class SupplierProduct(Document):
    supplier_id: PydanticObjectId
    name: str
    category: str
    sku: str
    stock: int
    unit_price: float
    status: ProductStatus = ProductStatus.IN_STOCK

    class Settings:
        name = "supplier_products"


class SupplierOrder(Document):
    supplier_id: PydanticObjectId
    items: List[dict] = Field(default_factory=list)
    total: float
    status: str = "pending"
    order_date: str

    class Settings:
        name = "supplier_orders"
