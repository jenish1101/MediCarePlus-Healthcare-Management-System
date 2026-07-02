from datetime import datetime, timezone
from typing import List, Optional

from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field

from app.core.enums import (
    CatalogTestStatus,
    EquipmentStatus,
    LabReportStatus,
    SampleStatus,
)


class LabResultRow(BaseModel):
    parameter: str
    value: str
    reference: str
    flag: Optional[str] = None


class LabReport(Document):
    patient_id: PydanticObjectId
    test_name: str
    date: str
    status: LabReportStatus = LabReportStatus.PENDING
    results_summary: Optional[str] = None
    result_rows: List[LabResultRow] = Field(default_factory=list)
    doctor_notes: Optional[str] = None
    assigned_tech_id: Optional[PydanticObjectId] = None

    class Settings:
        name = "lab_reports"


class LabTestCatalog(Document):
    name: str
    category: str
    price: float
    turnaround: str
    sample_type: str
    status: CatalogTestStatus = CatalogTestStatus.AVAILABLE

    class Settings:
        name = "lab_test_catalog"


class LabSample(Document):
    sample_id: str
    patient_id: PydanticObjectId
    patient_name: str
    test_name: str
    collected_at: str
    status: SampleStatus = SampleStatus.COLLECTED
    location: str

    class Settings:
        name = "lab_samples"


class LabEquipment(Document):
    name: str
    model: str
    location: str
    last_calibration: str
    next_calibration: str
    status: EquipmentStatus = EquipmentStatus.OPERATIONAL
    qc_score: Optional[int] = None

    class Settings:
        name = "lab_equipment"


class LabCollectionAppointment(Document):
    patient_id: PydanticObjectId
    patient_name: str
    test_name: str
    date: str
    time: str
    status: str = "scheduled"

    class Settings:
        name = "lab_collection_appointments"
