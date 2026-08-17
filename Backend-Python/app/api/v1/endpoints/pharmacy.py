from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, Query, status

from app.core.dependencies import CurrentUser, InventoryViewerUser, PatientUser, PharmacistOrAdminUser, PharmacistUser
from app.core.enums import OrderStatus, ReturnStatus
from app.schemas.pharmacy import (
    ExpiryAlertOut,
    FulfillmentOut,
    InventoryCreate,
    InventoryOut,
    OrderCreate,
    OrderOut,
    PurchaseOrderCreate,
    PurchaseOrderOut,
    ReturnOut,
    SalesSummary,
    SupplierOut,
)
from app.services import pharmacy as pharmacy_service

router = APIRouter(prefix="/pharmacy", tags=["Pharmacy"])


@router.get("/inventory", response_model=List[InventoryOut])
async def list_inventory(
    _: InventoryViewerUser,
    low_stock: bool = Query(False),
) -> List[InventoryOut]:
    return await pharmacy_service.list_inventory(low_stock)


@router.post("/inventory", response_model=InventoryOut, status_code=status.HTTP_201_CREATED)
async def add_inventory(body: InventoryCreate, _: PharmacistOrAdminUser) -> InventoryOut:
    return await pharmacy_service.add_inventory(body)


@router.get("/orders", response_model=List[OrderOut])
async def list_orders(current_user: CurrentUser) -> List[OrderOut]:
    return await pharmacy_service.list_orders(current_user)


@router.post("/orders", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def create_order(body: OrderCreate, patient: PatientUser) -> OrderOut:
    return await pharmacy_service.create_order(body, patient)


@router.patch("/orders/{order_id}/status", response_model=OrderOut)
async def update_order_status(
    order_id: PydanticObjectId,
    status_value: OrderStatus,
    _: PharmacistOrAdminUser,
) -> OrderOut:
    return await pharmacy_service.update_order_status(order_id, status_value)


@router.get("/fulfillment", response_model=List[FulfillmentOut])
async def list_fulfillment(_: PharmacistUser) -> List[FulfillmentOut]:
    return await pharmacy_service.list_fulfillment()


@router.post("/fulfillment/{fulfillment_id}/advance", response_model=FulfillmentOut)
async def advance_fulfillment(fulfillment_id: PydanticObjectId, _: PharmacistUser) -> FulfillmentOut:
    return await pharmacy_service.advance_fulfillment(fulfillment_id)


@router.get("/purchase-orders", response_model=List[PurchaseOrderOut])
async def list_purchase_orders(_: PharmacistUser) -> List[PurchaseOrderOut]:
    return await pharmacy_service.list_purchase_orders()


@router.post("/purchase-orders", response_model=PurchaseOrderOut, status_code=status.HTTP_201_CREATED)
async def create_purchase_order(body: PurchaseOrderCreate, _: PharmacistUser) -> PurchaseOrderOut:
    return await pharmacy_service.create_purchase_order(body)


@router.get("/returns", response_model=List[ReturnOut])
async def list_returns(_: PharmacistUser) -> List[ReturnOut]:
    return await pharmacy_service.list_returns()


@router.patch("/returns/{return_id}/status", response_model=ReturnOut)
async def update_return_status(
    return_id: PydanticObjectId,
    status_value: ReturnStatus,
    _: PharmacistUser,
) -> ReturnOut:
    return await pharmacy_service.update_return_status(return_id, status_value)


@router.get("/suppliers", response_model=List[SupplierOut])
async def list_suppliers(_: PharmacistOrAdminUser) -> List[SupplierOut]:
    return await pharmacy_service.list_suppliers()


@router.get("/expiry-alerts", response_model=List[ExpiryAlertOut])
async def list_expiry_alerts(_: PharmacistOrAdminUser) -> List[ExpiryAlertOut]:
    return await pharmacy_service.list_expiry_alerts()


@router.get("/sales", response_model=SalesSummary)
async def pharmacy_sales(_: PharmacistOrAdminUser) -> SalesSummary:
    return await pharmacy_service.pharmacy_sales()
