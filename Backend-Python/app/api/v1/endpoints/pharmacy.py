from typing import List, Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from app.core.dependencies import CurrentUser, require_roles
from app.core.enums import (
    FulfillmentStatus,
    OrderStatus,
    PurchaseOrderStatus,
    ReturnStatus,
    UserRole,
)
from app.models.pharmacy import (
    FulfillmentPrescription,
    InventoryItem,
    OrderMedicineItem,
    PharmacyOrder,
    PurchaseOrder,
    PurchaseOrderItem,
    ReturnRequest,
    SupplierInfo,
)
from app.models.user import User
from app.schemas.common import MessageResponse

router = APIRouter(prefix="/pharmacy", tags=["Pharmacy"])


# Inventory
class InventoryOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    medicine_name: str
    batch_number: str
    quantity: int
    expiry_date: str
    supplier: str
    price: float

    model_config = {"populate_by_name": True}


class InventoryCreate(BaseModel):
    medicine_name: str
    batch_number: str
    quantity: int
    expiry_date: str
    supplier: str
    price: float


@router.get("/inventory", response_model=List[InventoryOut])
async def list_inventory(
    low_stock: bool = Query(False),
    _: User = Depends(require_roles(UserRole.PHARMACIST, UserRole.ADMIN)),
) -> List[InventoryOut]:
    items = await InventoryItem.find_all().to_list()
    if low_stock:
        items = [i for i in items if i.quantity < 500]
    return [InventoryOut(_id=i.id, **i.model_dump(exclude={"id"})) for i in items]


@router.post("/inventory", response_model=InventoryOut, status_code=status.HTTP_201_CREATED)
async def add_inventory(
    body: InventoryCreate,
    _: User = Depends(require_roles(UserRole.PHARMACIST, UserRole.ADMIN)),
) -> InventoryOut:
    item = InventoryItem(**body.model_dump())
    await item.insert()
    return InventoryOut(_id=item.id, **item.model_dump(exclude={"id"}))


# Orders
class OrderCreate(BaseModel):
    medicines: List[OrderMedicineItem]
    address: str
    prescription_id: Optional[PydanticObjectId] = None


class OrderOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    medicines: List[OrderMedicineItem]
    total: float
    status: OrderStatus
    date: str
    address: str

    model_config = {"populate_by_name": True}


@router.get("/orders", response_model=List[OrderOut])
async def list_orders(current_user: CurrentUser) -> List[OrderOut]:
    if current_user.role == UserRole.PATIENT:
        items = await PharmacyOrder.find(PharmacyOrder.patient_id == current_user.id).to_list()
    else:
        items = await PharmacyOrder.find_all().to_list()
    return [OrderOut(_id=o.id, **o.model_dump(exclude={"id"})) for o in items]


@router.post("/orders", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def create_order(
    body: OrderCreate,
    patient: User = Depends(require_roles(UserRole.PATIENT)),
) -> OrderOut:
    from datetime import date

    total = sum(m.quantity * m.price for m in body.medicines)
    order = PharmacyOrder(
        patient_id=patient.id,
        medicines=body.medicines,
        total=total,
        date=str(date.today()),
        address=body.address,
        prescription_id=body.prescription_id,
    )
    await order.insert()
    return OrderOut(_id=order.id, **order.model_dump(exclude={"id"}))


@router.patch("/orders/{order_id}/status", response_model=OrderOut)
async def update_order_status(
    order_id: PydanticObjectId,
    status_value: OrderStatus,
    _: User = Depends(require_roles(UserRole.PHARMACIST, UserRole.ADMIN)),
) -> OrderOut:
    order = await PharmacyOrder.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status_value
    await order.save()
    return OrderOut(_id=order.id, **order.model_dump(exclude={"id"}))


# Fulfillment
class FulfillmentOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    rx_id: str
    prescription_id: PydanticObjectId
    patient_name: str
    doctor_name: str
    date: str
    medicines: List[str]
    status: FulfillmentStatus

    model_config = {"populate_by_name": True}


@router.get("/fulfillment", response_model=List[FulfillmentOut])
async def list_fulfillment(_: User = Depends(require_roles(UserRole.PHARMACIST))) -> List[FulfillmentOut]:
    items = await FulfillmentPrescription.find_all().to_list()
    return [FulfillmentOut(_id=f.id, **f.model_dump(exclude={"id"})) for f in items]


@router.post("/fulfillment/{fulfillment_id}/advance", response_model=FulfillmentOut)
async def advance_fulfillment(
    fulfillment_id: PydanticObjectId,
    _: User = Depends(require_roles(UserRole.PHARMACIST)),
) -> FulfillmentOut:
    item = await FulfillmentPrescription.get(fulfillment_id)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    flow = [FulfillmentStatus.PENDING, FulfillmentStatus.DISPENSING, FulfillmentStatus.DISPENSED]
    idx = flow.index(item.status)
    if idx < len(flow) - 1:
        item.status = flow[idx + 1]
        await item.save()
    return FulfillmentOut(_id=item.id, **item.model_dump(exclude={"id"}))


# Purchase orders
class PurchaseOrderCreate(BaseModel):
    supplier: str
    items: List[PurchaseOrderItem]
    order_date: str
    expected_delivery: str


class PurchaseOrderOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    supplier: str
    items: List[PurchaseOrderItem]
    total: float
    order_date: str
    expected_delivery: str
    status: PurchaseOrderStatus

    model_config = {"populate_by_name": True}


@router.get("/purchase-orders", response_model=List[PurchaseOrderOut])
async def list_purchase_orders(_: User = Depends(require_roles(UserRole.PHARMACIST))) -> List[PurchaseOrderOut]:
    items = await PurchaseOrder.find_all().to_list()
    return [PurchaseOrderOut(_id=p.id, **p.model_dump(exclude={"id"})) for p in items]


@router.post("/purchase-orders", response_model=PurchaseOrderOut, status_code=status.HTTP_201_CREATED)
async def create_purchase_order(
    body: PurchaseOrderCreate,
    _: User = Depends(require_roles(UserRole.PHARMACIST)),
) -> PurchaseOrderOut:
    total = sum(i.quantity * i.unit_price for i in body.items)
    po = PurchaseOrder(total=total, status=PurchaseOrderStatus.DRAFT, **body.model_dump())
    await po.insert()
    return PurchaseOrderOut(_id=po.id, **po.model_dump(exclude={"id"}))


# Returns
class ReturnOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    order_id: PydanticObjectId
    patient_name: str
    medicines: List[str]
    amount: float
    reason: str
    request_date: str
    status: ReturnStatus

    model_config = {"populate_by_name": True}


@router.get("/returns", response_model=List[ReturnOut])
async def list_returns(_: User = Depends(require_roles(UserRole.PHARMACIST))) -> List[ReturnOut]:
    items = await ReturnRequest.find_all().to_list()
    return [ReturnOut(_id=r.id, **r.model_dump(exclude={"id", "patient_id"})) for r in items]


@router.patch("/returns/{return_id}/status", response_model=ReturnOut)
async def update_return_status(
    return_id: PydanticObjectId,
    status_value: ReturnStatus,
    _: User = Depends(require_roles(UserRole.PHARMACIST)),
) -> ReturnOut:
    item = await ReturnRequest.get(return_id)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    item.status = status_value
    await item.save()
    return ReturnOut(_id=item.id, **item.model_dump(exclude={"id", "patient_id"}))


# Suppliers
class SupplierOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    name: str
    contact_email: str
    contact_phone: str
    address: str
    products_count: int

    model_config = {"populate_by_name": True}


@router.get("/suppliers", response_model=List[SupplierOut])
async def list_suppliers(_: User = Depends(require_roles(UserRole.PHARMACIST, UserRole.ADMIN))) -> List[SupplierOut]:
    items = await SupplierInfo.find_all().to_list()
    return [SupplierOut(_id=s.id, **s.model_dump(exclude={"id"})) for s in items]


# Expiry alerts
class ExpiryAlertOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    medicine_name: str
    batch_number: str
    quantity: int
    expiry_date: str
    alert_type: str

    model_config = {"populate_by_name": True}


@router.get("/expiry-alerts", response_model=List[ExpiryAlertOut])
async def list_expiry_alerts(_: User = Depends(require_roles(UserRole.PHARMACIST, UserRole.ADMIN))) -> List[ExpiryAlertOut]:
    from datetime import date, timedelta

    items = await InventoryItem.find_all().to_list()
    today = date.today()
    threshold = today + timedelta(days=90)
    alerts: List[ExpiryAlertOut] = []
    for item in items:
        try:
            expiry = date.fromisoformat(item.expiry_date)
        except ValueError:
            continue
        alert_type = None
        if expiry <= today:
            alert_type = "expired"
        elif expiry <= threshold:
            alert_type = "expiring_soon"
        elif item.quantity < 500:
            alert_type = "low_stock"
        if alert_type:
            alerts.append(
                ExpiryAlertOut(
                    _id=item.id,
                    medicine_name=item.medicine_name,
                    batch_number=item.batch_number,
                    quantity=item.quantity,
                    expiry_date=item.expiry_date,
                    alert_type=alert_type,
                )
            )
    return alerts


# Sales analytics
class SalesSummary(BaseModel):
    monthly_sales: float
    growth_percent: float
    total_orders: int
    units_sold: int
    monthly: List[dict]
    top_sellers: List[dict]


@router.get("/sales", response_model=SalesSummary)
async def pharmacy_sales(_: User = Depends(require_roles(UserRole.PHARMACIST, UserRole.ADMIN))) -> SalesSummary:
    from collections import defaultdict

    orders = await PharmacyOrder.find(PharmacyOrder.status == OrderStatus.DELIVERED).to_list()
    total_revenue = sum(o.total for o in orders)
    units = sum(sum(m.quantity for m in o.medicines) for o in orders)
    monthly_map: dict[str, float] = defaultdict(float)
    for o in orders:
        month_key = o.date[:7] if o.date else "unknown"
        monthly_map[month_key] += o.total
    monthly = [{"month": k, "sales": round(v, 2)} for k, v in sorted(monthly_map.items())[-6:]]
    product_units: dict[str, dict] = defaultdict(lambda: {"units": 0, "revenue": 0.0})
    for o in orders:
        for m in o.medicines:
            product_units[m.name]["units"] += m.quantity
            product_units[m.name]["revenue"] += m.quantity * m.price
    top_sellers = sorted(
        [{"name": k, **v} for k, v in product_units.items()],
        key=lambda x: x["revenue"],
        reverse=True,
    )[:5]
    current = monthly[-1]["sales"] if monthly else 0
    previous = monthly[-2]["sales"] if len(monthly) > 1 else 0
    growth = round(((current - previous) / previous) * 100, 1) if previous else 0
    return SalesSummary(
        monthly_sales=round(current, 2),
        growth_percent=growth,
        total_orders=len(orders),
        units_sold=units,
        monthly=monthly,
        top_sellers=top_sellers,
    )
