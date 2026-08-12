from typing import List, Optional

from beanie import PydanticObjectId
from pydantic import BaseModel, Field

from app.core.enums import CatalogTestStatus, EquipmentStatus, LabReportStatus, SampleStatus
from app.models.lab import LabResultRow
from app.schemas.common import ORMModel


class LabReportOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    test_name: str
    date: str
    status: LabReportStatus
    results_summary: Optional[str] = None
    result_rows: List[LabResultRow] = []
    doctor_notes: Optional[str] = None


class LabReportUpdate(BaseModel):
    status: Optional[LabReportStatus] = None
    results_summary: Optional[str] = None
    result_rows: Optional[List[LabResultRow]] = None
    doctor_notes: Optional[str] = None


class CatalogOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    name: str
    category: str
    price: float
    turnaround: str
    sample_type: str
    status: CatalogTestStatus


class CatalogCreate(BaseModel):
    name: str
    category: str
    price: float
    turnaround: str
    sample_type: str
    status: CatalogTestStatus = CatalogTestStatus.AVAILABLE


class SampleOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    sample_id: str
    patient_id: PydanticObjectId
    patient_name: str
    test_name: str
    collected_at: str
    status: SampleStatus
    location: str


class SampleAdvance(BaseModel):
    sample_id: Optional[str] = None
    status: Optional[SampleStatus] = None


class EquipmentOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    name: str
    model: str
    location: str
    last_calibration: str
    next_calibration: str
    status: EquipmentStatus
    qc_score: Optional[int] = None


class LabAppointmentOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    patient_id: PydanticObjectId
    patient_name: str
    test_name: str
    date: str
    time: str
    status: str


class LabTestOut(ORMModel):
    id: PydanticObjectId = Field(alias="_id")
    test_name: str
    patient_name: str
    requested_by: str
    date: str
    priority: str
    status: str
    results: Optional[str] = None
