from typing import List, Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, Query, status

from app.core.dependencies import (
    AdminOrPatientUser,
    AdminOrReceptionistUser,
    AdminUser,
    BedManagementUser,
    NurseUser,
    PatientUser,
    StaffNotificationsUser,
    SupplierUser,
)
from app.schemas.admin import (
    AnnouncementCreate,
    AnnouncementOut,
    AuditOut,
    BedOut,
    BedUpdate,
    DepartmentCreate,
    DepartmentOut,
    InvoiceOut,
    NotificationOut,
    NurseTaskOut,
    OnboardingOut,
    ProductOut,
    SupplierOrderOut,
)
from app.schemas.common import MessageResponse
from app.services import admin as admin_service

router = APIRouter(tags=["Admin & Operations"])


@router.get("/beds", response_model=List[BedOut])
async def list_beds(_: BedManagementUser) -> List[BedOut]:
    return await admin_service.list_beds()


@router.patch("/beds/{bed_id}", response_model=BedOut)
async def update_bed(bed_id: PydanticObjectId, body: BedUpdate, _: AdminOrReceptionistUser) -> BedOut:
    return await admin_service.update_bed(bed_id, body)


@router.get("/departments", response_model=List[DepartmentOut])
async def list_departments(_: AdminUser) -> List[DepartmentOut]:
    return await admin_service.list_departments()


@router.post("/departments", response_model=DepartmentOut, status_code=status.HTTP_201_CREATED)
async def create_department(body: DepartmentCreate, admin: AdminUser) -> DepartmentOut:
    return await admin_service.create_department(body, admin)


@router.delete("/departments/{dept_id}", response_model=MessageResponse)
async def delete_department(dept_id: PydanticObjectId, admin: AdminUser) -> MessageResponse:
    await admin_service.delete_department(dept_id, admin)
    return MessageResponse(message="Department deleted")


@router.get("/billing/invoices", response_model=List[InvoiceOut])
async def list_invoices(
    current_user: AdminOrPatientUser,
    patient_id: Optional[PydanticObjectId] = Query(None),
) -> List[InvoiceOut]:
    return await admin_service.list_invoices(current_user, patient_id)


@router.post("/billing/invoices/{invoice_id}/pay", response_model=InvoiceOut)
async def pay_invoice(invoice_id: PydanticObjectId, patient: PatientUser) -> InvoiceOut:
    return await admin_service.pay_invoice(invoice_id, patient)


@router.get("/audit-log", response_model=List[AuditOut])
async def list_audit_log(_: AdminUser) -> List[AuditOut]:
    return await admin_service.list_audit_log()


@router.get("/announcements", response_model=List[AnnouncementOut])
async def list_announcements(role: Optional[str] = Query(None)) -> List[AnnouncementOut]:
    return await admin_service.list_announcements(role)


@router.post("/announcements", response_model=AnnouncementOut, status_code=status.HTTP_201_CREATED)
async def create_announcement(body: AnnouncementCreate, admin: AdminUser) -> AnnouncementOut:
    return await admin_service.create_announcement(body, admin)


@router.patch("/announcements/{ann_id}/archive", response_model=AnnouncementOut)
async def archive_announcement(ann_id: PydanticObjectId, admin: AdminUser) -> AnnouncementOut:
    return await admin_service.archive_announcement(ann_id, admin)


@router.get("/doctor-onboarding", response_model=List[OnboardingOut])
async def list_pending_doctors(_: AdminUser) -> List[OnboardingOut]:
    return await admin_service.list_pending_doctors()


@router.post("/doctor-onboarding/{doctor_id}/approve", response_model=MessageResponse)
async def approve_doctor(doctor_id: PydanticObjectId, admin: AdminUser) -> MessageResponse:
    message = await admin_service.approve_doctor(doctor_id, admin)
    return MessageResponse(message=message)


@router.get("/analytics/summary")
async def analytics_summary(_: AdminUser) -> dict:
    return await admin_service.analytics_summary()


@router.get("/notifications", response_model=List[NotificationOut])
async def list_notifications(current_user: StaffNotificationsUser) -> List[NotificationOut]:
    return await admin_service.list_notifications(current_user)


@router.post("/notifications/{notification_id}/read", response_model=MessageResponse)
async def mark_notification_read(
    notification_id: PydanticObjectId,
    current_user: StaffNotificationsUser,
) -> MessageResponse:
    message = await admin_service.mark_notification_read(notification_id, current_user)
    return MessageResponse(message=message)


@router.post("/notifications/read-all", response_model=MessageResponse)
async def mark_all_read(current_user: StaffNotificationsUser) -> MessageResponse:
    message = await admin_service.mark_all_read(current_user)
    return MessageResponse(message=message)


@router.get("/nurse/tasks", response_model=List[NurseTaskOut])
async def list_nurse_tasks(_: NurseUser) -> List[NurseTaskOut]:
    return await admin_service.list_nurse_tasks()


@router.patch("/nurse/tasks/{task_id}/complete", response_model=NurseTaskOut)
async def complete_task(task_id: PydanticObjectId, _: NurseUser) -> NurseTaskOut:
    return await admin_service.complete_task(task_id)


@router.get("/supplier/products", response_model=List[ProductOut])
async def list_supplier_products(supplier: SupplierUser) -> List[ProductOut]:
    return await admin_service.list_supplier_products(supplier)


@router.get("/supplier/orders", response_model=List[SupplierOrderOut])
async def list_supplier_orders(supplier: SupplierUser) -> List[SupplierOrderOut]:
    return await admin_service.list_supplier_orders(supplier)
