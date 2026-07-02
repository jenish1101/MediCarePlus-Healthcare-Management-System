from typing import List, Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from app.core.dependencies import require_roles
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
    UserRole,
)
from app.models.admin import (
    Announcement,
    AuditLogEntry,
    Bed,
    Department,
    Invoice,
    Notification,
    NurseTask,
    Payment,
    SupplierOrder,
    SupplierProduct,
)
from app.models.user import User
from app.schemas.common import MessageResponse
from app.services.audit import log_audit

router = APIRouter(tags=["Admin & Operations"])


# --- Beds ---
class BedOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    room_number: str
    bed_type: BedType
    status: BedStatus
    patient_id: Optional[PydanticObjectId] = None
    patient_name: Optional[str] = None

    model_config = {"populate_by_name": True}


class BedUpdate(BaseModel):
    status: Optional[BedStatus] = None
    patient_id: Optional[PydanticObjectId] = None
    patient_name: Optional[str] = None


@router.get("/beds", response_model=List[BedOut])
async def list_beds(_: User = Depends(require_roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE))) -> List[BedOut]:
    items = await Bed.find_all().to_list()
    return [BedOut(_id=b.id, **b.model_dump(exclude={"id"})) for b in items]


@router.patch("/beds/{bed_id}", response_model=BedOut)
async def update_bed(
    bed_id: PydanticObjectId,
    body: BedUpdate,
    _: User = Depends(require_roles(UserRole.ADMIN, UserRole.RECEPTIONIST)),
) -> BedOut:
    bed = await Bed.get(bed_id)
    if not bed:
        raise HTTPException(status_code=404, detail="Bed not found")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(bed, k, v)
    await bed.save()
    return BedOut(_id=bed.id, **bed.model_dump(exclude={"id"}))


# --- Departments ---
class DepartmentOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    name: str
    head: str
    staff_count: int
    beds: int
    status: DepartmentStatus

    model_config = {"populate_by_name": True}


class DepartmentCreate(BaseModel):
    name: str
    head: str
    staff_count: int = 0
    beds: int = 0
    status: DepartmentStatus = DepartmentStatus.ACTIVE


@router.get("/departments", response_model=List[DepartmentOut])
async def list_departments(_: User = Depends(require_roles(UserRole.ADMIN))) -> List[DepartmentOut]:
    items = await Department.find_all().to_list()
    return [DepartmentOut(_id=d.id, **d.model_dump(exclude={"id"})) for d in items]


@router.post("/departments", response_model=DepartmentOut, status_code=status.HTTP_201_CREATED)
async def create_department(body: DepartmentCreate, admin: User = Depends(require_roles(UserRole.ADMIN))) -> DepartmentOut:
    dept = Department(**body.model_dump())
    await dept.insert()
    await log_audit(user_name=admin.name, role=admin.role, action="Created department", target=dept.name)
    return DepartmentOut(_id=dept.id, **dept.model_dump(exclude={"id"}))


@router.delete("/departments/{dept_id}", response_model=MessageResponse)
async def delete_department(dept_id: PydanticObjectId, admin: User = Depends(require_roles(UserRole.ADMIN))) -> MessageResponse:
    dept = await Department.get(dept_id)
    if not dept:
        raise HTTPException(status_code=404, detail="Not found")
    await dept.delete()
    await log_audit(user_name=admin.name, role=admin.role, action="Deleted department", target=dept.name)
    return MessageResponse(message="Department deleted")


# --- Billing ---
class InvoiceOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    patient_name: str
    service: str
    date: str
    amount: float
    status: InvoiceStatus

    model_config = {"populate_by_name": True}


@router.get("/billing/invoices", response_model=List[InvoiceOut])
async def list_invoices(
    patient_id: Optional[PydanticObjectId] = Query(None),
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.PATIENT)),
) -> List[InvoiceOut]:
    if current_user.role == UserRole.PATIENT:
        items = await Invoice.find(Invoice.patient_id == current_user.id).to_list()
    elif patient_id:
        items = await Invoice.find(Invoice.patient_id == patient_id).to_list()
    else:
        items = await Invoice.find_all().to_list()
    return [InvoiceOut(_id=i.id, **i.model_dump(exclude={"id"})) for i in items]


@router.post("/billing/invoices/{invoice_id}/pay", response_model=InvoiceOut)
async def pay_invoice(
    invoice_id: PydanticObjectId,
    patient: User = Depends(require_roles(UserRole.PATIENT)),
) -> InvoiceOut:
    invoice = await Invoice.get(invoice_id)
    if not invoice or invoice.patient_id != patient.id:
        raise HTTPException(status_code=404, detail="Invoice not found")
    invoice.status = InvoiceStatus.PAID
    await invoice.save()
    from datetime import date

    await Payment(
        patient_id=patient.id,
        invoice_id=invoice.id,
        amount=invoice.amount,
        date=str(date.today()),
        description=invoice.service,
    ).insert()
    return InvoiceOut(_id=invoice.id, **invoice.model_dump(exclude={"id"}))


# --- Audit log ---
class AuditOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    user_name: str
    role: str
    action: str
    target: str
    timestamp: str
    category: AuditCategory

    model_config = {"populate_by_name": True}


@router.get("/audit-log", response_model=List[AuditOut])
async def list_audit_log(_: User = Depends(require_roles(UserRole.ADMIN))) -> List[AuditOut]:
    items = await AuditLogEntry.find_all().sort("-timestamp").to_list()
    return [
        AuditOut(_id=a.id, timestamp=a.timestamp.isoformat(), **a.model_dump(exclude={"id", "timestamp"}))
        for a in items
    ]


# --- Announcements ---
class AnnouncementCreate(BaseModel):
    title: str
    message: str
    target_roles: List[str]


class AnnouncementOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    title: str
    message: str
    target_roles: List[str]
    created_at: str
    status: AnnouncementStatus

    model_config = {"populate_by_name": True}


@router.get("/announcements", response_model=List[AnnouncementOut])
async def list_announcements(role: Optional[str] = Query(None)) -> List[AnnouncementOut]:
    items = await Announcement.find(Announcement.status == AnnouncementStatus.ACTIVE).to_list()
    if role:
        items = [a for a in items if "all" in a.target_roles or role in a.target_roles]
    return [
        AnnouncementOut(_id=a.id, created_at=a.created_at.isoformat(), **a.model_dump(exclude={"id", "created_at"}))
        for a in items
    ]


@router.post("/announcements", response_model=AnnouncementOut, status_code=status.HTTP_201_CREATED)
async def create_announcement(body: AnnouncementCreate, admin: User = Depends(require_roles(UserRole.ADMIN))) -> AnnouncementOut:
    ann = Announcement(**body.model_dump())
    await ann.insert()
    return AnnouncementOut(_id=ann.id, created_at=ann.created_at.isoformat(), **ann.model_dump(exclude={"id", "created_at"}))


@router.patch("/announcements/{ann_id}/archive", response_model=AnnouncementOut)
async def archive_announcement(ann_id: PydanticObjectId, admin: User = Depends(require_roles(UserRole.ADMIN))) -> AnnouncementOut:
    ann = await Announcement.get(ann_id)
    if not ann:
        raise HTTPException(status_code=404, detail="Not found")
    ann.status = AnnouncementStatus.ARCHIVED
    await ann.save()
    return AnnouncementOut(_id=ann.id, created_at=ann.created_at.isoformat(), **ann.model_dump(exclude={"id", "created_at"}))


# --- Doctor onboarding ---
class OnboardingOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    name: str
    email: str
    specialization: str
    onboarding_status: OnboardingStatus

    model_config = {"populate_by_name": True}


@router.get("/doctor-onboarding", response_model=List[OnboardingOut])
async def list_pending_doctors(_: User = Depends(require_roles(UserRole.ADMIN))) -> List[OnboardingOut]:
    doctors = await User.find(User.role == UserRole.DOCTOR).to_list()
    pending = [d for d in doctors if d.doctor_profile and d.doctor_profile.onboarding_status == OnboardingStatus.PENDING]
    return [
        OnboardingOut(
            _id=d.id,
            name=d.name,
            email=d.email,
            specialization=d.doctor_profile.specialization,
            onboarding_status=d.doctor_profile.onboarding_status,
        )
        for d in pending
    ]


@router.post("/doctor-onboarding/{doctor_id}/approve", response_model=MessageResponse)
async def approve_doctor(doctor_id: PydanticObjectId, admin: User = Depends(require_roles(UserRole.ADMIN))) -> MessageResponse:
    doctor = await User.get(doctor_id)
    if not doctor or not doctor.doctor_profile:
        raise HTTPException(status_code=404, detail="Doctor not found")
    doctor.doctor_profile.onboarding_status = OnboardingStatus.APPROVED
    doctor.is_active = True
    await doctor.save()
    await log_audit(user_name=admin.name, role=admin.role, action="Approved doctor", target=doctor.email)
    return MessageResponse(message="Doctor approved")


# --- Analytics ---
@router.get("/analytics/summary")
async def analytics_summary(_: User = Depends(require_roles(UserRole.ADMIN))) -> dict:
    from app.models.clinical import Appointment

    users = await User.find_all().count()
    appointments = await Appointment.find_all().count()
    beds = await Bed.find_all().to_list()
    occupied = len([b for b in beds if b.status == BedStatus.OCCUPIED])
    return {
        "total_users": users,
        "total_appointments": appointments,
        "bed_occupancy": {"occupied": occupied, "total": len(beds)},
        "departments": await Department.find_all().count(),
    }


# --- Notifications ---
class NotificationOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    icon: str
    color: str
    title: str
    message: str
    time_label: str
    unread: bool
    category: Optional[str] = None

    model_config = {"populate_by_name": True}


@router.get("/notifications", response_model=List[NotificationOut])
async def list_notifications(current_user: User = Depends(require_roles(
    UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN, UserRole.PHARMACIST,
    UserRole.LAB_TECH, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.SUPPLIER,
))) -> List[NotificationOut]:
    items = await Notification.find(Notification.user_id == current_user.id).to_list()
    return [NotificationOut(_id=n.id, category=n.category, **n.model_dump(exclude={"id", "category"})) for n in items]


@router.post("/notifications/{notification_id}/read", response_model=MessageResponse)
async def mark_notification_read(notification_id: PydanticObjectId, current_user: User = Depends(require_roles(
    UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN, UserRole.PHARMACIST,
    UserRole.LAB_TECH, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.SUPPLIER,
))) -> MessageResponse:
    notif = await Notification.get(notification_id)
    if not notif or notif.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Not found")
    notif.unread = False
    await notif.save()
    return MessageResponse(message="Marked as read")


@router.post("/notifications/read-all", response_model=MessageResponse)
async def mark_all_read(current_user: User = Depends(require_roles(
    UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN, UserRole.PHARMACIST,
    UserRole.LAB_TECH, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.SUPPLIER,
))) -> MessageResponse:
    items = await Notification.find(Notification.user_id == current_user.id, Notification.unread == True).to_list()
    for n in items:
        n.unread = False
        await n.save()
    return MessageResponse(message="All marked as read")


# --- Nurse tasks ---
class NurseTaskOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_name: str
    room: str
    task_type: NurseTaskType
    description: str
    scheduled: str
    status: NurseTaskStatus

    model_config = {"populate_by_name": True}


@router.get("/nurse/tasks", response_model=List[NurseTaskOut])
async def list_nurse_tasks(_: User = Depends(require_roles(UserRole.NURSE))) -> List[NurseTaskOut]:
    items = await NurseTask.find_all().to_list()
    return [NurseTaskOut(_id=t.id, **t.model_dump(exclude={"id", "nurse_id"})) for t in items]


@router.patch("/nurse/tasks/{task_id}/complete", response_model=NurseTaskOut)
async def complete_task(task_id: PydanticObjectId, _: User = Depends(require_roles(UserRole.NURSE))) -> NurseTaskOut:
    task = await NurseTask.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Not found")
    task.status = NurseTaskStatus.COMPLETED
    await task.save()
    return NurseTaskOut(_id=task.id, **task.model_dump(exclude={"id", "nurse_id"}))


# --- Supplier ---
class ProductOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    name: str
    category: str
    sku: str
    stock: int
    unit_price: float
    status: ProductStatus

    model_config = {"populate_by_name": True}


@router.get("/supplier/products", response_model=List[ProductOut])
async def list_supplier_products(supplier: User = Depends(require_roles(UserRole.SUPPLIER))) -> List[ProductOut]:
    items = await SupplierProduct.find(SupplierProduct.supplier_id == supplier.id).to_list()
    return [ProductOut(_id=p.id, **p.model_dump(exclude={"id", "supplier_id"})) for p in items]


class SupplierOrderOut(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    total: float
    status: str
    order_date: str
    items: list

    model_config = {"populate_by_name": True}


@router.get("/supplier/orders", response_model=List[SupplierOrderOut])
async def list_supplier_orders(supplier: User = Depends(require_roles(UserRole.SUPPLIER))) -> List[SupplierOrderOut]:
    items = await SupplierOrder.find(SupplierOrder.supplier_id == supplier.id).to_list()
    return [SupplierOrderOut(_id=o.id, **o.model_dump(exclude={"id", "supplier_id"})) for o in items]
