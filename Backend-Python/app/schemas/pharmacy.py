from typing import List, Optional

from beanie import PydanticObjectId
from pydantic import BaseModel, Field

from app.core.enums import FulfillmentStatus, OrderStatus, PurchaseOrderStatus, ReturnStatus
from app.models.pharmacy import OrderMedicineItem, PurchaseOrderItem
from app.schemas.common import ORMModel


class InventoryOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    medicine_name: str
    batch_number: str
    quantity: int
    expiry_date: str
    supplier: str
    price: float


class InventoryCreate(BaseModel):
    medicine_name: str
    batch_number: str
    quantity: int
    expiry_date: str
    supplier: str
    price: float


class OrderCreate(BaseModel):
    medicines: List[OrderMedicineItem]
    address: str
    prescription_id: Optional[PydanticObjectId] = None


class OrderOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    medicines: List[OrderMedicineItem]
    total: float
    status: OrderStatus
    date: str
    address: str


class FulfillmentOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    rx_id: str
    prescription_id: PydanticObjectId
    patient_name: str
    doctor_name: str
    date: str
    medicines: List[str]
    status: FulfillmentStatus


class PurchaseOrderCreate(BaseModel):
    supplier: str
    items: List[PurchaseOrderItem]
    order_date: str
    expected_delivery: str


class PurchaseOrderOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    supplier: str
    items: List[PurchaseOrderItem]
    total: float
    order_date: str
    expected_delivery: str
    status: PurchaseOrderStatus


class ReturnOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    order_id: PydanticObjectId
    patient_name: str
    medicines: List[str]
    amount: float
    reason: str
    request_date: str
    status: ReturnStatus


class SupplierOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    name: str
    contact_email: str
    contact_phone: str
    address: str
    products_count: int


class ExpiryAlertOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    medicine_name: str
    batch_number: str
    quantity: int
    expiry_date: str
    alert_type: str


class SalesSummary(BaseModel):
    monthly_sales: float
    growth_percent: float
    total_orders: int
    units_sold: int
    monthly: List[dict]
    top_sellers: List[dict]
