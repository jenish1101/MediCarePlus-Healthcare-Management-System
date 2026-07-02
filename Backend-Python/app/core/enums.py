from enum import StrEnum


class UserRole(StrEnum):
    PATIENT = "patient"
    DOCTOR = "doctor"
    ADMIN = "admin"
    RECEPTIONIST = "receptionist"
    PHARMACIST = "pharmacist"
    LAB_TECH = "lab_tech"
    NURSE = "nurse"
    SUPPLIER = "supplier"


class AppointmentStatus(StrEnum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    RESCHEDULED = "rescheduled"


class AppointmentType(StrEnum):
    IN_PERSON = "in-person"
    VIDEO = "video"
    CHAT = "chat"


class OrderStatus(StrEnum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class LabReportStatus(StrEnum):
    PENDING = "pending"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"


class BedType(StrEnum):
    ICU = "ICU"
    GENERAL = "General"
    PRIVATE = "Private"


class BedStatus(StrEnum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    MAINTENANCE = "maintenance"


class InvoiceStatus(StrEnum):
    PAID = "paid"
    PENDING = "pending"
    OVERDUE = "overdue"


class PaymentStatus(StrEnum):
    COMPLETED = "completed"
    PENDING = "pending"
    FAILED = "failed"


class PaymentMethod(StrEnum):
    CARD = "card"
    UPI = "upi"
    WALLET = "wallet"
    CASH = "cash"


class FulfillmentStatus(StrEnum):
    PENDING = "pending"
    DISPENSING = "dispensing"
    DISPENSED = "dispensed"


class PurchaseOrderStatus(StrEnum):
    DRAFT = "draft"
    ORDERED = "ordered"
    SHIPPED = "shipped"
    RECEIVED = "received"


class ReturnStatus(StrEnum):
    PENDING = "pending"
    APPROVED = "approved"
    REFUNDED = "refunded"
    REJECTED = "rejected"


class SampleStatus(StrEnum):
    COLLECTED = "collected"
    IN_TRANSIT = "in-transit"
    RECEIVED = "received"
    PROCESSING = "processing"
    COMPLETED = "completed"


class EquipmentStatus(StrEnum):
    OPERATIONAL = "operational"
    MAINTENANCE = "maintenance"
    QC_PENDING = "qc-pending"
    OFFLINE = "offline"


class ReferralUrgency(StrEnum):
    ROUTINE = "routine"
    URGENT = "urgent"


class ReferralStatus(StrEnum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    COMPLETED = "completed"


class NotificationCategory(StrEnum):
    APPOINTMENT = "appointment"
    PRESCRIPTION = "prescription"
    LAB = "lab"
    PHARMACY = "pharmacy"
    BILLING = "billing"


class AuditCategory(StrEnum):
    USER = "user"
    SETTINGS = "settings"
    SECURITY = "security"
    BILLING = "billing"


class AnnouncementStatus(StrEnum):
    ACTIVE = "active"
    ARCHIVED = "archived"


class OnboardingStatus(StrEnum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class NurseTaskType(StrEnum):
    MEDICATION = "medication"
    CARE = "care"


class NurseTaskStatus(StrEnum):
    PENDING = "pending"
    COMPLETED = "completed"


class ProductStatus(StrEnum):
    IN_STOCK = "in-stock"
    LOW_STOCK = "low-stock"
    OUT_OF_STOCK = "out-of-stock"


class CatalogTestStatus(StrEnum):
    AVAILABLE = "available"
    LIMITED = "limited"


class DepartmentStatus(StrEnum):
    ACTIVE = "active"
    INACTIVE = "inactive"
