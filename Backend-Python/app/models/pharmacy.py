from typing import List, Optional

from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field

from app.core.enums import (
    FulfillmentStatus,
    OrderStatus,
    PurchaseOrderStatus,
    ReturnStatus,
)


class OrderMedicineItem(BaseModel):
    name: str
    quantity: int
    price: float


class PharmacyOrder(Document):
    patient_id: PydanticObjectId
    medicines: List[OrderMedicineItem] = Field(default_factory=list)
    total: float
    status: OrderStatus = OrderStatus.PENDING
    date: str
    address: str
    prescription_id: Optional[PydanticObjectId] = None

    class Settings:
        name = "pharmacy_orders"


class InventoryItem(Document):
    medicine_name: str
    batch_number: str
    quantity: int
    expiry_date: str
    supplier: str
    price: float

    class Settings:
        name = "inventory"


class FulfillmentPrescription(Document):
    rx_id: str
    prescription_id: PydanticObjectId
    patient_id: PydanticObjectId
    patient_name: str
    doctor_id: PydanticObjectId
    doctor_name: str
    date: str
    medicines: List[str] = Field(default_factory=list)
    status: FulfillmentStatus = FulfillmentStatus.PENDING

    class Settings:
        name = "fulfillment_prescriptions"


class PurchaseOrderItem(BaseModel):
    name: str
    quantity: int
    unit_price: float


class PurchaseOrder(Document):
    supplier: str
    items: List[PurchaseOrderItem] = Field(default_factory=list)
    total: float
    order_date: str
    expected_delivery: str
    status: PurchaseOrderStatus = PurchaseOrderStatus.DRAFT

    class Settings:
        name = "purchase_orders"


class ReturnRequest(Document):
    order_id: PydanticObjectId
    patient_id: PydanticObjectId
    patient_name: str
    medicines: List[str] = Field(default_factory=list)
    amount: float
    reason: str
    request_date: str
    status: ReturnStatus = ReturnStatus.PENDING

    class Settings:
        name = "return_requests"


class SupplierInfo(Document):
    name: str
    contact_email: str
    contact_phone: str
    address: str
    products_count: int = 0

    class Settings:
        name = "suppliers"
