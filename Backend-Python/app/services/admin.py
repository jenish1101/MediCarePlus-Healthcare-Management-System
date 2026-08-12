from datetime import date
from typing import List, Optional

from beanie import PydanticObjectId

from app.core.enums import (
    AnnouncementStatus,
    BedStatus,
    InvoiceStatus,
    NurseTaskStatus,
    OnboardingStatus,
    UserRole,
)
from app.core.exceptions import NotFoundError
from app.core.utils import get_or_404
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
from app.models.clinical import Appointment
from app.models.user import User
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
from app.services.audit import log_audit


async def list_beds() -> List[BedOut]:
    items = await Bed.find_all().to_list()
    return [BedOut(_id=b.id, **b.model_dump(exclude={"id"})) for b in items]


async def update_bed(bed_id: PydanticObjectId, body: BedUpdate) -> BedOut:
    bed = await get_or_404(Bed, bed_id, "Bed not found")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(bed, k, v)
    await bed.save()
    return BedOut(_id=bed.id, **bed.model_dump(exclude={"id"}))


async def list_departments() -> List[DepartmentOut]:
    items = await Department.find_all().to_list()
    return [DepartmentOut(_id=d.id, **d.model_dump(exclude={"id"})) for d in items]


async def create_department(body: DepartmentCreate, admin: User) -> DepartmentOut:
    dept = Department(**body.model_dump())
    await dept.insert()
    await log_audit(user_name=admin.name, role=admin.role, action="Created department", target=dept.name)
    return DepartmentOut(_id=dept.id, **dept.model_dump(exclude={"id"}))


async def delete_department(dept_id: PydanticObjectId, admin: User) -> str:
    dept = await get_or_404(Department, dept_id, "Not found")
    await dept.delete()
    await log_audit(user_name=admin.name, role=admin.role, action="Deleted department", target=dept.name)
    return "Department deleted"


async def list_invoices(
    current_user: User,
    patient_id: Optional[PydanticObjectId] = None,
) -> List[InvoiceOut]:
    if current_user.role == UserRole.PATIENT:
        items = await Invoice.find(Invoice.patient_id == current_user.id).to_list()
    elif patient_id:
        items = await Invoice.find(Invoice.patient_id == patient_id).to_list()
    else:
        items = await Invoice.find_all().to_list()
    return [InvoiceOut(_id=i.id, **i.model_dump(exclude={"id"})) for i in items]


async def pay_invoice(invoice_id: PydanticObjectId, patient: User) -> InvoiceOut:
    invoice = await Invoice.get(invoice_id)
    if not invoice or invoice.patient_id != patient.id:
        raise NotFoundError("Invoice not found")
    invoice.status = InvoiceStatus.PAID
    await invoice.save()
    await Payment(
        patient_id=patient.id,
        invoice_id=invoice.id,
        amount=invoice.amount,
        date=str(date.today()),
        description=invoice.service,
    ).insert()
    return InvoiceOut(_id=invoice.id, **invoice.model_dump(exclude={"id"}))


async def list_audit_log() -> List[AuditOut]:
    items = await AuditLogEntry.find_all().sort("-timestamp").to_list()
    return [
        AuditOut(_id=a.id, timestamp=a.timestamp.isoformat(), **a.model_dump(exclude={"id", "timestamp"}))
        for a in items
    ]


async def list_announcements(role: Optional[str] = None) -> List[AnnouncementOut]:
    items = await Announcement.find(Announcement.status == AnnouncementStatus.ACTIVE).to_list()
    if role:
        items = [a for a in items if "all" in a.target_roles or role in a.target_roles]
    return [
        AnnouncementOut(_id=a.id, created_at=a.created_at.isoformat(), **a.model_dump(exclude={"id", "created_at"}))
        for a in items
    ]


async def create_announcement(body: AnnouncementCreate, admin: User) -> AnnouncementOut:
    ann = Announcement(**body.model_dump())
    await ann.insert()
    return AnnouncementOut(_id=ann.id, created_at=ann.created_at.isoformat(), **ann.model_dump(exclude={"id", "created_at"}))


async def archive_announcement(ann_id: PydanticObjectId, admin: User) -> AnnouncementOut:
    ann = await get_or_404(Announcement, ann_id, "Not found")
    ann.status = AnnouncementStatus.ARCHIVED
    await ann.save()
    return AnnouncementOut(_id=ann.id, created_at=ann.created_at.isoformat(), **ann.model_dump(exclude={"id", "created_at"}))


async def list_pending_doctors() -> List[OnboardingOut]:
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


async def approve_doctor(doctor_id: PydanticObjectId, admin: User) -> str:
    doctor = await User.get(doctor_id)
    if not doctor or not doctor.doctor_profile:
        raise NotFoundError("Doctor not found")
    doctor.doctor_profile.onboarding_status = OnboardingStatus.APPROVED
    doctor.is_active = True
    await doctor.save()
    await log_audit(user_name=admin.name, role=admin.role, action="Approved doctor", target=doctor.email)
    return "Doctor approved"


async def analytics_summary() -> dict:
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


async def list_notifications(current_user: User) -> List[NotificationOut]:
    items = await Notification.find(Notification.user_id == current_user.id).to_list()
    return [NotificationOut(_id=n.id, category=n.category, **n.model_dump(exclude={"id", "category"})) for n in items]


async def mark_notification_read(notification_id: PydanticObjectId, current_user: User) -> str:
    notif = await Notification.get(notification_id)
    if not notif or notif.user_id != current_user.id:
        raise NotFoundError("Not found")
    notif.unread = False
    await notif.save()
    return "Marked as read"


async def mark_all_read(current_user: User) -> str:
    items = await Notification.find(Notification.user_id == current_user.id, Notification.unread == True).to_list()
    for n in items:
        n.unread = False
        await n.save()
    return "All marked as read"


async def list_nurse_tasks() -> List[NurseTaskOut]:
    items = await NurseTask.find_all().to_list()
    return [NurseTaskOut(_id=t.id, **t.model_dump(exclude={"id", "nurse_id"})) for t in items]


async def complete_task(task_id: PydanticObjectId) -> NurseTaskOut:
    task = await get_or_404(NurseTask, task_id, "Not found")
    task.status = NurseTaskStatus.COMPLETED
    await task.save()
    return NurseTaskOut(_id=task.id, **task.model_dump(exclude={"id", "nurse_id"}))


async def list_supplier_products(supplier: User) -> List[ProductOut]:
    items = await SupplierProduct.find(SupplierProduct.supplier_id == supplier.id).to_list()
    return [ProductOut(_id=p.id, **p.model_dump(exclude={"id", "supplier_id"})) for p in items]


async def list_supplier_orders(supplier: User) -> List[SupplierOrderOut]:
    items = await SupplierOrder.find(SupplierOrder.supplier_id == supplier.id).to_list()
    return [SupplierOrderOut(_id=o.id, **o.model_dump(exclude={"id", "supplier_id"})) for o in items]
