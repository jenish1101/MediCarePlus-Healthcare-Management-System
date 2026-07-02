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
from app.models.clinical import Appointment, MedicalNote, Prescription, Referral
from app.models.lab import (
    LabCollectionAppointment,
    LabEquipment,
    LabReport,
    LabSample,
    LabTestCatalog,
)
from app.models.messaging import MessageThread
from app.models.pharmacy import (
    FulfillmentPrescription,
    InventoryItem,
    PharmacyOrder,
    PurchaseOrder,
    ReturnRequest,
    SupplierInfo,
)
from app.models.user import FamilyMember, InsurancePolicy, User

DOCUMENT_MODELS = [
    User,
    FamilyMember,
    InsurancePolicy,
    Appointment,
    Prescription,
    MedicalNote,
    Referral,
    LabReport,
    LabTestCatalog,
    LabSample,
    LabEquipment,
    LabCollectionAppointment,
    PharmacyOrder,
    InventoryItem,
    FulfillmentPrescription,
    PurchaseOrder,
    ReturnRequest,
    SupplierInfo,
    Bed,
    Department,
    Invoice,
    Payment,
    Notification,
    AuditLogEntry,
    Announcement,
    NurseTask,
    SupplierProduct,
    SupplierOrder,
    MessageThread,
]
