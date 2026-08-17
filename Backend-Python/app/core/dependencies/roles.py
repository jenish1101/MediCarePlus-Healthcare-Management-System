try:
    from typing import Annotated
except ImportError:
    from typing_extensions import Annotated

from fastapi import Depends

from app.core.dependencies.auth import get_current_user, require_roles
from app.core.enums import UserRole
from app.models.user import User

AdminUser = Annotated[User, Depends(require_roles(UserRole.ADMIN))]
DoctorUser = Annotated[User, Depends(require_roles(UserRole.DOCTOR))]
PatientUser = Annotated[User, Depends(require_roles(UserRole.PATIENT))]
PharmacistUser = Annotated[User, Depends(require_roles(UserRole.PHARMACIST))]
LabTechUser = Annotated[User, Depends(require_roles(UserRole.LAB_TECH))]
ReceptionistUser = Annotated[User, Depends(require_roles(UserRole.RECEPTIONIST))]
NurseUser = Annotated[User, Depends(require_roles(UserRole.NURSE))]
SupplierUser = Annotated[User, Depends(require_roles(UserRole.SUPPLIER))]

ClinicalStaffUser = Annotated[
    User,
    Depends(require_roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.NURSE)),
]
PatientOrReceptionistUser = Annotated[
    User,
    Depends(require_roles(UserRole.PATIENT, UserRole.RECEPTIONIST)),
]
StaffNotificationsUser = Annotated[
    User,
    Depends(
        require_roles(
            UserRole.PATIENT,
            UserRole.DOCTOR,
            UserRole.ADMIN,
            UserRole.PHARMACIST,
            UserRole.LAB_TECH,
            UserRole.RECEPTIONIST,
            UserRole.NURSE,
            UserRole.SUPPLIER,
        )
    ),
]
BedManagementUser = Annotated[
    User,
    Depends(require_roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE)),
]
PatientListUser = Annotated[
    User,
    Depends(require_roles(UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.ADMIN)),
]
PharmacistOrAdminUser = Annotated[
    User,
    Depends(require_roles(UserRole.PHARMACIST, UserRole.ADMIN)),
]
InventoryViewerUser = Annotated[
    User,
    Depends(require_roles(UserRole.PATIENT, UserRole.PHARMACIST, UserRole.ADMIN)),
]
LabTechOrAdminUser = Annotated[
    User,
    Depends(require_roles(UserRole.LAB_TECH, UserRole.ADMIN)),
]
LabTechOrReceptionistUser = Annotated[
    User,
    Depends(require_roles(UserRole.LAB_TECH, UserRole.RECEPTIONIST)),
]
LabReportEditorUser = Annotated[
    User,
    Depends(require_roles(UserRole.LAB_TECH, UserRole.DOCTOR, UserRole.ADMIN)),
]
AdminOrPatientUser = Annotated[
    User,
    Depends(require_roles(UserRole.ADMIN, UserRole.PATIENT)),
]
AdminOrReceptionistUser = Annotated[
    User,
    Depends(require_roles(UserRole.ADMIN, UserRole.RECEPTIONIST)),
]
